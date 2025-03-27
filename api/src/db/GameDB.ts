import { Redis } from 'ioredis';
import { AppService } from '../services/AppService';

export type GameStatus = 'pending' | 'settled';
export type GamePrediction = 'long' | 'short';
export type GameResult = 'win' | 'loss';

export interface Game {
  id: string;
  userId: string;
  status: GameStatus;
  startTime: number;
  endTime: number | null;
  betAmount: number;
  priceAtStart: number;
  priceAtEnd: number | null;
  prediction: GamePrediction;
  result: GameResult | null;
  pointsWon: number | null;
}

const GAME_PREFIX = 'game';

export class GameDB {
  private static getRedisClient(): Redis {
    return AppService.getInstance().getRedisClient();
  }

  /**
   * Create a new game in Redis
   */
  public static async createGame(game: Game): Promise<void> {
    const redis = this.getRedisClient();
    const key = `${GAME_PREFIX}:${game.id}:${game.userId}:${game.status}`;
    await redis.set(key, JSON.stringify(game));
  }

  /**
   * Get a game by ID
   */
  public static async getGame(gameId: string, userId: string): Promise<Game | null> {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:${gameId}:${userId}:*`;
    
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return null;
    }
    
    const gameData = await redis.get(keys[0]);
    
    if (!gameData) {
      return null;
    }
    
    return JSON.parse(gameData) as Game;
  }

  /**
   * Update a game's status and other fields
   */
  public static async updateGame(game: Game): Promise<boolean> {
    const redis = this.getRedisClient();
    
    // Delete old entry (in case status has changed)
    const pattern = `${GAME_PREFIX}:${game.id}:${game.userId}:*`;
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    
    // Create new entry with updated data
    const newKey = `${GAME_PREFIX}:${game.id}:${game.userId}:${game.status}`;
    await redis.set(newKey, JSON.stringify(game));
    
    return true;
  }

  /**
   * Get all games for a user
   */
  public static async getUserGames(userId: string): Promise<Game[]> {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:*:${userId}:*`;
    
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return [];
    }
    
    const gamesData = await redis.mget(...keys);
    
    return gamesData
      .filter((data): data is string => data !== null)
      .map(data => JSON.parse(data) as Game);
  }

  /**
   * Get all games with a specific status
   */
  public static async getGamesByStatus(status: GameStatus): Promise<Game[]> {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:*:*:${status}`;
    
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return [];
    }
    
    const gamesData = await redis.mget(...keys);
    
    return gamesData
      .filter((data): data is string => data !== null)
      .map(data => JSON.parse(data) as Game);
  }

  /**
   * Find pending games for a user
   */
  public static async getPendingGameForUser(userId: string): Promise<Game | null> {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:*:${userId}:pending`;
    
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return null;
    }
    
    const gameData = await redis.get(keys[0]);
    
    if (!gameData) {
      return null;
    }
    
    return JSON.parse(gameData) as Game;
  }
} 