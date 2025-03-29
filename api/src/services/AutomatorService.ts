import { User, UserDB, GameBoost } from '../db/UserDB';
import { Game, GameDB, GameStatus } from '../db/GameDB';
import { BoostService } from './BoostService';
import { PriceService } from './PriceService';
import { AppService } from './AppService';
import { v4 as uuidv4 } from 'uuid';

/**
 * This service handles the Super Automator boost functionality.
 * It is intended to be called by a scheduled cron job.
 */
export class AutomatorService {
  /**
   * Run the automator for all users with active Super Automator boosts
   */
  public static async runAutomator(): Promise<{ success: boolean; gamesCreated: number; }> {
    try {
      const redis = AppService.getInstance().getRedisClient();
      const userKeys = await redis.keys('user:*');
      
      let gamesCreated = 0;
      
      // Process each user
      for (const key of userKeys) {
        const userData = await redis.get(key);
        if (!userData) continue;
        
        const user = JSON.parse(userData) as User;
        
        // Skip users without boosts
        if (!user.boosts || user.boosts.length === 0) continue;
        
        // Find the highest level automator boost that is unlocked
        let highestAutomatorBoost: GameBoost | null = null;
        
        for (const boost of user.boosts) {
          if (boost.type === 'superAutomator' && boost.unlocked) {
            if (!highestAutomatorBoost || (boost.level && highestAutomatorBoost.level && boost.level > highestAutomatorBoost.level)) {
              highestAutomatorBoost = boost;
            }
          }
        }
        
        // Skip if no automator boost found
        if (!highestAutomatorBoost) continue;
        
        // Get boost configuration
        const boostConfig = BoostService.getBoostConfig('superAutomator', highestAutomatorBoost.level);
        if (!boostConfig || !boostConfig.cooldown) continue;
        
        // Check if boost is ready to be used
        const lastUsed = highestAutomatorBoost.lastUsed || 0;
        const timeSinceLastUse = Date.now() - lastUsed;
        
        if (timeSinceLastUse >= boostConfig.cooldown) {
          // Boost is ready to be used
          if (user.coins < 100) continue; // Skip if not enough coins
          
          // Create a new game
          const game = await this.createAutomatedGame(user.id);
          if (game) {
            gamesCreated++;
            
            // Update boost usage time
            await UserDB.updateBoostUsage(user.id, 'superAutomator', highestAutomatorBoost.level);
          }
        }
      }
      
      return { success: true, gamesCreated };
    } catch (error) {
      console.error('Error running automator:', error);
      return { success: false, gamesCreated: 0 };
    }
  }
  
  /**
   * Create an automated game for a user
   */
  private static async createAutomatedGame(userId: string): Promise<Game | null> {
    try {
      const user = await UserDB.getUser(userId);
      if (!user) return null;
      
      // Check if user has enough coins
      if (user.coins < 100) return null;
      
      // Deduct coins
      const deducted = await UserDB.deductCoins(userId, 100);
      if (!deducted) return null;
      
      // Get current ETH price
      const currentPrice = await this.getCurrentPrice();
      if (!currentPrice) return null;
      
      // Randomly select prediction (long or short)
      const prediction = Math.random() > 0.5 ? 'long' : 'short';
      
      // Create a new game
      const game: Game = {
        id: uuidv4(),
        userId,
        status: 'pending',
        startTime: Date.now(),
        endTime: null,
        betAmount: 100,
        priceAtStart: currentPrice,
        priceAtEnd: null,
        prediction,
        result: null,
        pointsWon: null
      };
      
      // Save game to database
      await GameDB.createGame(game);
      
      // Set timer to settle the game after 1 minute
      setTimeout(() => {
        this.settleAutomatedGame(game.id, userId);
      }, 60000);
      
      return game;
    } catch (error) {
      console.error('Error creating automated game:', error);
      return null;
    }
  }
  
  /**
   * Settle an automated game
   */
  private static async settleAutomatedGame(gameId: string, userId: string): Promise<void> {
    try {
      // Get game from database
      const game = await GameDB.getGame(gameId, userId);
      if (!game || game.status !== 'pending') return;
      
      // Get current ETH price
      const currentPrice = await this.getCurrentPrice();
      if (!currentPrice) return;
      
      // Determine game result
      const priceChange = currentPrice - game.priceAtStart;
      let result: 'win' | 'loss' = 'loss';
      
      if ((game.prediction === 'long' && priceChange > 0) || 
          (game.prediction === 'short' && priceChange < 0)) {
        result = 'win';
      }
      
      // Calculate points won
      const pointsWon = result === 'win' 
        ? game.betAmount * 2 
        : Math.floor(game.betAmount * 0.1);
      
      // Update game
      game.status = 'settled';
      game.endTime = Date.now();
      game.priceAtEnd = currentPrice;
      game.result = result;
      game.pointsWon = pointsWon;
      
      await GameDB.updateGame(game);
      
      // Update user's points
      await UserDB.addPoints(userId, pointsWon);
      
      // Update user's game stats
      const user = await UserDB.getUser(userId);
      if (user) {
        user.gamesPlayed = (user.gamesPlayed || 0) + 1;
        if (result === 'win') {
          user.gamesWon = (user.gamesWon || 0) + 1;
        }
        await UserDB.saveUser(user);
      }
    } catch (error) {
      console.error('Error settling automated game:', error);
    }
  }

  /**
   * Get current ETH price
   * This is a helper method that uses PriceService.fetchEthPrice
   */
  private static async getCurrentPrice(): Promise<number> {
    try {
      const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
      return await PriceService.fetchEthPrice(timestamp);
    } catch (error) {
      console.error('Error getting current ETH price:', error);
      return 0; // Return 0 to indicate an error
    }
  }
} 