import { Hono } from 'hono';
import { GameDB, Game, GamePrediction, GameResult } from '../db/GameDB';
import { UserDB } from '../db/UserDB';
import { requireAuth } from '../utils/auth';
import { PriceService } from '../services/PriceService';
import crypto from 'crypto';

// Custom function to generate a unique ID
function generateId(): string {
  // Generate a random string (12 characters should be enough for our use case)
  return crypto.randomBytes(6).toString('hex');
}

const game = new Hono();

/**
 * Complete a game by checking the ETH price and updating the game status
 * @param gameId The ID of the game to complete
 * @param userId The ID of the user who owns the game
 */
async function completeGame(gameId: string, userId: string): Promise<void> {
  try {
    // Fetch the current game state
    const currentGame = await GameDB.getGame(gameId, userId);
    
    if (!currentGame || currentGame.status !== 'pending') {
      console.log(`Game ${gameId} is no longer pending or doesn't exist.`);
      return;
    }
    
    // Get ETH price after 60 seconds
    const endTimestamp = Math.floor(Date.now() / 1000);
    let priceAtEnd: number;
    
    try {
      priceAtEnd = await PriceService.fetchEthPrice(endTimestamp);
    } catch (error) {
      console.error(`Error fetching ETH price for game ${gameId}:`, error);
      // If we can't get the end price, we can't determine the result
      // Let's retry in 30 seconds
      setTimeout(() => {
        console.log(`Retrying to fetch price for game ${gameId} after failure`);
        completeGame(gameId, userId);
      }, 30 * 1000);
      return;
    }
    
    console.log(`Game ${gameId} - Start Price: ${currentGame.priceAtStart}, End Price: ${priceAtEnd}`);
    
    // Determine result - if prices are exactly equal (which could happen with fallback), 
    // make a slight adjustment to ensure a clear result
    let result: GameResult;
    
    // First check if the prices are numerically same
    if (Math.abs(priceAtEnd - currentGame.priceAtStart) < 0.0001) {
      // Prices are equal, make a slight adjustment based on prediction
      // Let's be fair and alternate between win/loss
      const randomOutcome = Math.random() > 0.5;
      result = randomOutcome ? 'win' : 'loss';
      console.log(`Game ${gameId} - Prices nearly identical, randomized result to: ${result}`);
    } else if (
      (currentGame.prediction === 'long' && priceAtEnd > currentGame.priceAtStart) ||
      (currentGame.prediction === 'short' && priceAtEnd < currentGame.priceAtStart)
    ) {
      result = 'win';
    } else {
      result = 'loss';
    }
    
    // Calculate points won
    const pointsWon = result === 'win' 
      ? currentGame.betAmount * 2 
      : Math.floor(currentGame.betAmount * 0.1);
    
    // Update game
    const updatedGame: Game = {
      ...currentGame,
      status: 'settled',
      endTime: Date.now(),
      priceAtEnd,
      result,
      pointsWon
    };
    
    await GameDB.updateGame(updatedGame);
    
    // Add points to user
    await UserDB.addPoints(userId, pointsWon);
    
    console.log(`Game ${gameId} completed with result: ${result}, points won: ${pointsWon}`);
  } catch (error) {
    console.error(`Error completing game ${gameId}:`, error);
  }
}

/**
 * POST /game/new - Create a new prediction game
 * 
 * Body: {
 *   betAmount: number (100-500, increments of 100),
 *   prediction: 'long' | 'short'
 * }
 */
game.post('/new', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Check if user already has a pending game
    const pendingGame = await GameDB.getPendingGameForUser(user.id);
    if (pendingGame) {
      return c.json({ 
        success: false, 
        error: 'You already have a game in progress. Please wait for it to complete.' 
      }, 400);
    }
    
    const body = await c.req.json();
    const { betAmount, prediction } = body;
    
    // Validate betAmount
    if (!betAmount || typeof betAmount !== 'number' || ![100, 200, 300, 400, 500].includes(betAmount)) {
      return c.json({ 
        success: false, 
        error: 'Bet amount must be one of: 100, 200, 300, 400, or 500 coins' 
      }, 400);
    }
    
    // Validate prediction
    if (!prediction || !['long', 'short'].includes(prediction)) {
      return c.json({ 
        success: false, 
        error: 'Prediction must be either "long" or "short"' 
      }, 400);
    }
    
    // Verify user has enough coins
    if (user.coins < betAmount) {
      return c.json({ 
        success: false, 
        error: 'Not enough coins' 
      }, 400);
    }
    
    // Get current ETH price
    const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
    let priceAtStart: number;
    
    try {
      priceAtStart = await PriceService.fetchEthPrice(timestamp);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to fetch current ETH price. Please try again.' 
      }, 500);
    }
    
    // Deduct coins from user
    await UserDB.deductCoins(user.id, betAmount);
    
    // Create new game
    const gameId = generateId();
    const startTime = Date.now();
    
    const game: Game = {
      id: gameId,
      userId: user.id,
      status: 'pending',
      startTime,
      endTime: null,
      betAmount,
      priceAtStart,
      priceAtEnd: null,
      prediction: prediction as GamePrediction,
      result: null,
      pointsWon: null
    };
    
    await GameDB.createGame(game);
    
    // Schedule game completion after 60 seconds
    setTimeout(() => completeGame(gameId, user.id), 60 * 1000);
    
    return c.json({ success: true, data: game });
  } catch (error) {
    console.error('Error creating game:', error);
    return c.json({ success: false, error: 'Failed to create game' }, 500);
  }
});

/**
 * GET /game/:id - Get a specific game with time left information
 */
game.get('/:id', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const gameId = c.req.param('id');
    const game = await GameDB.getGame(gameId, user.id);
    
    if (!game) {
      return c.json({ success: false, error: 'Game not found' }, 404);
    }
    
    // Calculate time left if game is pending
    let timeLeft = null;
    if (game.status === 'pending') {
      const elapsedTime = Date.now() - game.startTime;
      const timeLeftMs = Math.max(0, 60 * 1000 - elapsedTime);
      timeLeft = Math.ceil(timeLeftMs / 1000); // Convert to seconds
    }
    
    return c.json({ 
      success: true, 
      data: {
        ...game,
        timeLeft
      }
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return c.json({ success: false, error: 'Failed to fetch game' }, 500);
  }
});

export default game; 