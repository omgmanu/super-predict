import { v4 as uuidv4 } from 'uuid';
import { User, UserDB, GameBoost } from '../db/UserDB';
import { AppService } from './AppService';

// Define boost types and their details
interface BoostConfig {
  name: string;
  description: string;
  cost: number; // points cost to unlock
  cooldown?: number; // milliseconds
  reward?: number | string;
  available?: boolean; // whether the boost is available for use
}

// Boost configuration
const BOOST_CONFIG: Record<string, BoostConfig | BoostConfig[]> = {
  superDistributor: [
    {
      name: 'Super Distributor (Level 1)',
      description: 'Distribute 100 coins to all players once every 12h',
      cost: 4000,
      cooldown: 12 * 60 * 60 * 1000, // 12 hours
      available: true
    },
    {
      name: 'Super Distributor (Level 2)',
      description: 'Distribute 200 coins to all players once every 10h',
      cost: 10000,
      cooldown: 10 * 60 * 60 * 1000, // 10 hours
      available: true
    },
    {
      name: 'Super Distributor (Level 3)',
      description: 'Distribute 300 coins to all players once every 8h',
      cost: 25000,
      cooldown: 8 * 60 * 60 * 1000, // 8 hours
      available: true
    }
  ],
  superAutomator: [
    {
      name: 'Super Automator (Level 1)',
      description: 'Auto play 100 coins every 190 minutes (random prediction)',
      cost: 5000,
      cooldown: 190 * 60 * 1000, // 190 minutes
      available: true
    },
    {
      name: 'Super Automator (Level 2)',
      description: 'Auto play 100 coins every 130 minutes (random prediction)',
      cost: 14000,
      cooldown: 130 * 60 * 1000, // 130 minutes
      available: true
    },
    {
      name: 'Super Automator (Level 3)',
      description: 'Auto play 100 coins every 70 minutes (random prediction)',
      cost: 34000,
      cooldown: 70 * 60 * 1000, // 70 minutes
      available: true
    }
  ],
  followX: {
    name: 'Follow Superseed on X',
    description: 'Follow Superseed on X to earn points',
    cost: 0, // Action boosts have no cost
    reward: 500,
    available: true
  },
  rtPost: {
    name: 'RT Post of Game Submission',
    description: 'Retweet our game submission to earn points',
    cost: 0, // Action boosts have no cost
    reward: 800,
    available: true
  },
  connectGenesis: {
    name: 'Genesis Seeders - Connect Wallet',
    description: 'Connect your Genesis Seeder wallet to earn points',
    cost: 0, // Action boosts have no cost
    reward: 'To be announced',
    available: false
  },
  connectSuperseed: {
    name: 'Superseed Points System - Connect Wallet',
    description: 'Connect your Superseed Points wallet to earn points',
    cost: 0, // Action boosts have no cost
    reward: 'To be announced',
    available: false
  }
};

export class BoostService {
  /**
   * Get boost configuration by type and level
   */
  public static getBoostConfig(type: string, level?: number): BoostConfig | null {
    const config = BOOST_CONFIG[type];
    
    if (!config) {
      return null;
    }
    
    if (Array.isArray(config)) {
      return level && level >= 1 && level <= config.length 
        ? config[level - 1] 
        : null;
    }
    
    return config;
  }

  /**
   * Buy a boost for a user
   */
  public static async buyBoost(userId: string, type: string, level: number): Promise<{ success: boolean; error?: string; }> {
    try {
      // Get boost configuration
      const config = this.getBoostConfig(type, level);
      
      if (!config) {
        return { success: false, error: 'Invalid boost type or level' };
      }
      
      // Check if user exists
      const user = await UserDB.getUser(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      // Check if user has enough points
      if (user.points < config.cost) {
        return { success: false, error: 'Not enough points' };
      }
      
      // For leveled boosts, check if user has previous level
      if (Array.isArray(BOOST_CONFIG[type]) && level > 1) {
        const hasPreviousLevel = await UserDB.hasPreviousLevelBoost(userId, type, level);
        if (!hasPreviousLevel) {
          return { success: false, error: 'You need to unlock the previous level first' };
        }
      }
      
      // Check if user already has this boost
      const hasBoost = await UserDB.hasBoost(userId, type, level);
      if (hasBoost) {
        return { success: false, error: 'Boost already unlocked' };
      }
      
      // Create the boost
      const boost: GameBoost = {
        id: uuidv4(),
        type: type as any,
        level: level as any,
        unlocked: true,
      };
      
      // Add the boost to the user
      const addedBoost = await UserDB.addBoost(userId, boost);
      if (!addedBoost) {
        return { success: false, error: 'Failed to add boost' };
      }
      
      // Deduct points from user
      await UserDB.addPoints(userId, -config.cost);
      
      return { success: true };
    } catch (error) {
      console.error('Error buying boost:', error);
      return { success: false, error: 'An error occurred while buying the boost' };
    }
  }

  /**
   * Use a boost
   */
  public static async useBoost(userId: string, type: string, level?: number): Promise<{ success: boolean; error?: string; reward?: number; }> {
    try {
      // For action boosts (without level)
      if (!level && (type === 'followX' || type === 'rtPost' || type === 'connectGenesis' || type === 'connectSuperseed')) {
        return await this.useActionBoost(userId, type);
      }
      
      // For feature boosts (with level)
      if (level && (type === 'superDistributor' || type === 'superAutomator')) {
        return await this.useFeatureBoost(userId, type, level);
      }
      
      return { success: false, error: 'Invalid boost type' };
    } catch (error) {
      console.error('Error using boost:', error);
      return { success: false, error: 'An error occurred while using the boost' };
    }
  }

  /**
   * Use an action boost (like followX)
   */
  private static async useActionBoost(userId: string, type: string): Promise<{ success: boolean; error?: string; reward?: number; }> {
    // Get boost configuration
    const config = this.getBoostConfig(type);
    console.log(`[BoostService] useActionBoost called for user ${userId}, boost type ${type}`);
    console.log(`[BoostService] config:`, config);
      
    if (!config) {
      return { success: false, error: 'Invalid boost type' };
    }
    
    // Check if boost is available
    if (config.available === false) {
      return { success: false, error: 'This boost is not available yet' };
    }
    
    // Check if user exists
    const user = await UserDB.getUser(userId);
    console.log(`[BoostService] user:`, user ? { id: user.id, points: user.points } : null);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Check if user already has this boost
    const hasBoost = await UserDB.hasBoost(userId, type);
    console.log(`[BoostService] hasBoost:`, hasBoost);
    
    if (hasBoost) {
      return { success: false, error: 'Boost already used' };
    }
    
    // For social media actions, add a verification delay
    // This encourages users to actually visit and interact with the page
    if (type === 'followX' || type === 'rtPost') {
      // Add a small delay to ensure the user had time to visit the page
      // This isn't foolproof but adds a small barrier to simply clicking without visiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Create the boost
    const boost: GameBoost = {
      id: uuidv4(),
      type: type as any,
      unlocked: true,
      lastUsed: Date.now(),
    };
    
    // Add the boost to the user
    const addedBoost = await UserDB.addBoost(userId, boost);
    console.log(`[BoostService] addedBoost:`, addedBoost);
    
    if (!addedBoost) {
      return { success: false, error: 'Failed to add boost' };
    }
    
    // Award points to the user
    const reward = typeof config.reward === 'number' ? config.reward : 0;
    console.log(`[BoostService] reward to add:`, reward);
    
    if (reward > 0) {
      const pointsAdded = await UserDB.addPoints(userId, reward);
      console.log(`[BoostService] pointsAdded result:`, pointsAdded);
      
      if (!pointsAdded) {
        console.error(`[BoostService] Failed to add points to user ${userId}`);
        // Still return success but log the error
      }
    }
    
    // Get updated user to verify points were added
    const updatedUser = await UserDB.getUser(userId);
    console.log(`[BoostService] updated user:`, updatedUser ? { id: updatedUser.id, points: updatedUser.points } : null);
    
    return { success: true, reward };
  }

  /**
   * Use a feature boost (like superDistributor)
   */
  private static async useFeatureBoost(userId: string, type: string, level: number): Promise<{ success: boolean; error?: string; }> {
    // Get boost configuration
    const config = this.getBoostConfig(type, level);
      
    if (!config) {
      return { success: false, error: 'Invalid boost type or level' };
    }
    
    // Check if user exists
    const user = await UserDB.getUser(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Check if user has this boost
    const hasBoost = await UserDB.hasBoost(userId, type, level);
    if (!hasBoost) {
      return { success: false, error: 'Boost not unlocked' };
    }
    
    // Check cooldown
    const boost = await UserDB.getBoost(userId, type, level);
    if (boost?.lastUsed && config.cooldown) {
      const timeSinceLastUse = Date.now() - boost.lastUsed;
      if (timeSinceLastUse < config.cooldown) {
        const remainingTime = Math.ceil((config.cooldown - timeSinceLastUse) / (60 * 1000)); // minutes
        return { success: false, error: `Boost on cooldown for another ${remainingTime} minutes` };
      }
    }
    
    // Update last used timestamp
    await UserDB.updateBoostUsage(userId, type, level);
    
    // Handle super distributor
    if (type === 'superDistributor') {
      const coinsToDistribute = level * 100;
      await this.distributeCoinsToAllUsers(coinsToDistribute);
    }
    
    // Automator is handled by a separate cron/process
    
    return { success: true };
  }

  /**
   * Distribute coins to all users
   */
  private static async distributeCoinsToAllUsers(coinsToDistribute: number): Promise<{ usersUpdated: number; totalDistributed: number; }> {
    const redis = AppService.getInstance().getRedisClient();
    const userKeys = await redis.keys('user:*');
    
    const MAX_COINS = 1000;
    const BATCH_SIZE = 50;
    let totalDistributed = 0;
    let usersUpdated = 0;
    
    // Process users in batches
    for (let i = 0; i < userKeys.length; i += BATCH_SIZE) {
      const batchKeys = userKeys.slice(i, i + BATCH_SIZE);
      const pipeline = redis.pipeline();
      
      // Get all users in the batch
      const userDataPromises = batchKeys.map(key => redis.get(key));
      const userDataResults = await Promise.all(userDataPromises);
      
      // Process each user in the batch
      for (let j = 0; j < batchKeys.length; j++) {
        const key = batchKeys[j];
        const userData = userDataResults[j];
        
        if (!userData) continue;
        
        const user = JSON.parse(userData) as User;
        const currentCoins = user.coins || 0;
        
        // Calculate how many coins to add
        const coinsToAdd = Math.min(
          coinsToDistribute,
          MAX_COINS - currentCoins
        );
        
        if (coinsToAdd > 0) {
          user.coins = currentCoins + coinsToAdd;
          pipeline.set(key, JSON.stringify(user));
          totalDistributed += coinsToAdd;
          usersUpdated++;
        }
      }
      
      // Execute the batch update
      await pipeline.exec();
    }
    
    return { usersUpdated, totalDistributed };
  }

  /**
   * Migrate existing boosts to include usageCount (admin utility)
   * This should be called once to update existing users in the database
   */
  public static async migrateBoostsToIncludeUsageCount(): Promise<{ usersUpdated: number; }> {
    try {
      const redis = AppService.getInstance().getRedisClient();
      const userKeys = await redis.keys('user:*');
      let usersUpdated = 0;
      
      for (const key of userKeys) {
        const userData = await redis.get(key);
        if (!userData) continue;
        
        const user = JSON.parse(userData) as User;
        let updated = false;
        
        if (user.boosts && user.boosts.length > 0) {
          for (const boost of user.boosts) {
            if (boost.usageCount === undefined) {
              boost.usageCount = 0;
              updated = true;
            }
          }
          
          if (updated) {
            await redis.set(key, JSON.stringify(user));
            usersUpdated++;
          }
        }
      }
      
      return { usersUpdated };
    } catch (error) {
      console.error('Error migrating boosts:', error);
      return { usersUpdated: 0 };
    }
  }
} 