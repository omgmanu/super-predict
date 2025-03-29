import { Hono } from 'hono';
import { GameDB, Game, GamePrediction } from '../db/GameDB';
import { UserDB } from '../db/UserDB';
import { requireAuth } from '../utils/auth';
import crypto from 'crypto';

// Custom function to generate a unique ID
function generateId(): string {
  // Generate a random string (12 characters should be enough for our use case)
  return crypto.randomBytes(6).toString('hex');
}

const games = new Hono();

// Create a new game
games.post('/new', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { betAmount, prediction, priceAtStart } = body;
    
    // Validate input
    if (!betAmount || !prediction || !priceAtStart) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    // Verify user has enough points
    if (user.points < betAmount) {
      return c.json({ success: false, error: 'Not enough points' }, 400);
    }
    
    // Deduct points from user
    await UserDB.updatePoints(user.id, user.points - betAmount);
    
    // Create new game with our custom ID generator
    const gameId = generateId();
    
    const game: Game = {
      id: gameId,
      userId: user.id,
      status: 'pending',
      startTime: Date.now(),
      endTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours later
      betAmount,
      priceAtStart,
      priceAtEnd: null,
      prediction: prediction as GamePrediction,
      result: null,
      pointsWon: null
    };
    
    await GameDB.createGame(game);
    
    return c.json({ success: true, data: game });
  } catch (error) {
    console.error('Error creating game:', error);
    return c.json({ success: false, error: 'Failed to create game' }, 500);
  }
});

// List all games for the current user
games.get('/', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const games = await GameDB.getUserGames(user.id);
    
    return c.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching games:', error);
    return c.json({ success: false, error: 'Failed to fetch games' }, 500);
  }
});

// Get a specific game
games.get('/:id', async (c) => {
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
    
    return c.json({ success: true, data: game });
  } catch (error) {
    console.error('Error fetching game:', error);
    return c.json({ success: false, error: 'Failed to fetch game' }, 500);
  }
});

// Get recent winning games
games.get('/recent/wins', async (c) => {
  try {
    // This is a public endpoint, no auth required
    const limitParam = c.req.query('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    if (isNaN(limit) || limit <= 0) {
      return c.json({ 
        success: false, 
        error: 'Limit must be a positive number' 
      }, 400);
    }
    
    const recentGames = await GameDB.getRecentWinningGames(limit);
    
    // For each game, fetch the username
    const gamesWithUsernames = await Promise.all(
      recentGames.map(async (game) => {
        const user = await UserDB.getUser(game.userId);
        return {
          ...game,
          username: user ? user.username : 'Unknown'
        };
      })
    );
    
    return c.json({ success: true, data: gamesWithUsernames });
  } catch (error) {
    console.error('Error fetching recent games:', error);
    return c.json({ success: false, error: 'Failed to fetch recent games' }, 500);
  }
});

export default games; 