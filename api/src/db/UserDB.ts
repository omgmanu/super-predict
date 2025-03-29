import { Redis } from 'ioredis';
import { AppService } from '../services/AppService';

export interface GameBoost {
  id: string;
  type: 'superDistributor' | 'superAutomator' | 'followX' | 'rtPost' | 'connectGenesis' | 'connectSuperseed';
  level?: 1 | 2 | 3;
  unlocked: boolean;
  lastUsed?: number; // timestamp when last used (for cooldown)
  usageCount?: number; // track how many times the boost has been used
}

export interface User {
  id: string; // Using X's ID directly as the user ID
  username: string;
  profileImageUrl: string;
  points: number;
  coins: number; // User's coin balance
  gamesPlayed: number;
  gamesWon: number;
  boosts?: GameBoost[]; // User's game boosts
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

  /**
   * Add or update a boost for a user
   */
  public static async addBoost(userId: string, boost: GameBoost): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    if (!user.boosts) {
      user.boosts = [];
    }
    
    // Initialize usageCount if not set
    if (boost.usageCount === undefined) {
      boost.usageCount = 0;
    }
    
    // Check if user already has this boost
    const existingBoostIndex = user.boosts.findIndex(
      (b) => b.type === boost.type && (boost.level === undefined || b.level === boost.level)
    );
    
    if (existingBoostIndex >= 0) {
      // Update existing boost but preserve usageCount if it exists
      if (user.boosts[existingBoostIndex].usageCount !== undefined) {
        boost.usageCount = user.boosts[existingBoostIndex].usageCount;
      }
      user.boosts[existingBoostIndex] = boost;
    } else {
      // Add new boost
      user.boosts.push(boost);
    }
    
    await this.saveUser(user);
    return true;
  }

  /**
   * Get a specific boost for a user
   */
  public static async getBoost(userId: string, boostType: string, level?: number): Promise<GameBoost | null> {
    const user = await this.getUser(userId);
    
    if (!user || !user.boosts) {
      return null;
    }
    
    const boost = user.boosts.find(
      (b) => b.type === boostType && (level === undefined || b.level === level)
    );
    
    return boost || null;
  }

  /**
   * Check if user has a specific boost
   */
  public static async hasBoost(userId: string, boostType: string, level?: number): Promise<boolean> {
    const boost = await this.getBoost(userId, boostType, level);
    return !!boost && boost.unlocked;
  }

  /**
   * Check if user has previous level of a boost
   */
  public static async hasPreviousLevelBoost(userId: string, boostType: string, level: number): Promise<boolean> {
    if (level === 1) {
      return true; // Level 1 doesn't require previous level
    }
    
    return await this.hasBoost(userId, boostType, level - 1);
  }

  /**
   * Update last used timestamp for a boost
   */
  public static async updateBoostUsage(userId: string, boostType: string, level?: number): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (!user || !user.boosts) {
      return false;
    }
    
    const boostIndex = user.boosts.findIndex(
      (b) => b.type === boostType && (level === undefined || b.level === level)
    );
    
    if (boostIndex === -1) {
      return false;
    }
    
    user.boosts[boostIndex].lastUsed = Date.now();
    
    // Increment usageCount for superDistributor boosts
    if (boostType === 'superDistributor') {
      user.boosts[boostIndex].usageCount = (user.boosts[boostIndex].usageCount || 0) + 1;
    }
    
    await this.saveUser(user);
    return true;
  }
} 