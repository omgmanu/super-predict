import { Redis } from 'ioredis';
import { AppService } from '../services/AppService';

export interface User {
  id: string; // Using X's ID directly as the user ID
  username: string;
  profileImageUrl: string;
  points: number;
  coins: number; // User's coin balance
  gamesPlayed: number;
  gamesWon: number;
  // Additional properties from XUser will be included here
}

const USER_PREFIX = 'user';

export class UserDB {
  private static getRedisClient(): Redis {
    return AppService.getInstance().getRedisClient();
  }

  /**
   * Create or update a user in Redis
   */
  public static async saveUser(user: User): Promise<void> {
    const redis = this.getRedisClient();
    const key = `${USER_PREFIX}:${user.id}`;
    await redis.set(key, JSON.stringify(user));
  }

  /**
   * Get a user by ID
   */
  public static async getUser(userId: string): Promise<User | null> {
    const redis = this.getRedisClient();
    const key = `${USER_PREFIX}:${userId}`;
    const userData = await redis.get(key);
    
    if (!userData) {
      return null;
    }
    
    return JSON.parse(userData) as User;
  }

  /**
   * Delete a user by ID
   */
  public static async deleteUser(userId: string): Promise<boolean> {
    const redis = this.getRedisClient();
    const key = `${USER_PREFIX}:${userId}`;
    const deleted = await redis.del(key);
    return deleted > 0;
  }

  /**
   * Update user points
   */
  public static async updatePoints(userId: string, points: number): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    user.points = points;
    await this.saveUser(user);
    return true;
  }

  /**
   * Add points to a user
   */
  public static async addPoints(userId: string, pointsToAdd: number): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    user.points = (user.points || 0) + pointsToAdd;
    await this.saveUser(user);
    return true;
  }

  /**
   * Update user coins
   */
  public static async updateCoins(userId: string, coins: number): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    user.coins = coins;
    await this.saveUser(user);
    return true;
  }

  /**
   * Add coins to a user
   */
  public static async addCoins(userId: string, coinsToAdd: number): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    user.coins = (user.coins || 0) + coinsToAdd;
    await this.saveUser(user);
    return true;
  }

  /**
   * Deduct coins from a user
   */
  public static async deductCoins(userId: string, coinsToDeduct: number): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    if (user.coins < coinsToDeduct) {
      return false;
    }
    
    user.coins -= coinsToDeduct;
    await this.saveUser(user);
    return true;
  }

  /**
   * Get users ordered by points (for leaderboard)
   * This method returns the top users by points
   */
  public static async getLeaderboard(limit = 100): Promise<User[]> {
    const redis = this.getRedisClient();
    const pattern = `${USER_PREFIX}:*`;
    
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return [];
    }
    
    const usersData = await redis.mget(...keys);
    
    const users = usersData
      .filter((data): data is string => data !== null)
      .map(data => JSON.parse(data) as User);
    
    // Sort users by points in descending order and take the top 'limit'
    return users
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
} 