var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var BoostService_exports = {};
__export(BoostService_exports, {
  BoostService: () => BoostService
});
module.exports = __toCommonJS(BoostService_exports);
var import_uuid = require("uuid");
var import_UserDB = require("../db/UserDB");
var import_AppService = require("./AppService");
const BOOST_CONFIG = {
  superDistributor: [
    {
      name: "Super Distributor (Level 1)",
      description: "Distribute 100 coins to all players once every 12h",
      cost: 4e3,
      cooldown: 12 * 60 * 60 * 1e3,
      // 12 hours
      available: true
    },
    {
      name: "Super Distributor (Level 2)",
      description: "Distribute 200 coins to all players once every 10h",
      cost: 1e4,
      cooldown: 10 * 60 * 60 * 1e3,
      // 10 hours
      available: true
    },
    {
      name: "Super Distributor (Level 3)",
      description: "Distribute 300 coins to all players once every 8h",
      cost: 25e3,
      cooldown: 8 * 60 * 60 * 1e3,
      // 8 hours
      available: true
    }
  ],
  superAutomator: [
    {
      name: "Super Automator (Level 1)",
      description: "Auto play 100 coins every 190 minutes (random prediction)",
      cost: 5e3,
      cooldown: 190 * 60 * 1e3,
      // 190 minutes
      available: true
    },
    {
      name: "Super Automator (Level 2)",
      description: "Auto play 100 coins every 130 minutes (random prediction)",
      cost: 14e3,
      cooldown: 130 * 60 * 1e3,
      // 130 minutes
      available: true
    },
    {
      name: "Super Automator (Level 3)",
      description: "Auto play 100 coins every 70 minutes (random prediction)",
      cost: 34e3,
      cooldown: 70 * 60 * 1e3,
      // 70 minutes
      available: true
    }
  ],
  followX: {
    name: "Follow Superseed on X",
    description: "Follow Superseed on X to earn points",
    cost: 0,
    // Action boosts have no cost
    reward: 500,
    available: true
  },
  rtPost: {
    name: "RT Post of Game Submission",
    description: "Retweet our game submission to earn points",
    cost: 0,
    // Action boosts have no cost
    reward: 800,
    available: true
  },
  connectGenesis: {
    name: "Genesis Seeders - Connect Wallet",
    description: "Connect your Genesis Seeder wallet to earn points",
    cost: 0,
    // Action boosts have no cost
    reward: "To be announced",
    available: false
  },
  connectSuperseed: {
    name: "Superseed Points System - Connect Wallet",
    description: "Connect your Superseed Points wallet to earn points",
    cost: 0,
    // Action boosts have no cost
    reward: "To be announced",
    available: false
  }
};
class BoostService {
  /**
   * Get boost configuration by type and level
   */
  static getBoostConfig(type, level) {
    const config = BOOST_CONFIG[type];
    if (!config) {
      return null;
    }
    if (Array.isArray(config)) {
      return level && level >= 1 && level <= config.length ? config[level - 1] : null;
    }
    return config;
  }
  /**
   * Buy a boost for a user
   */
  static async buyBoost(userId, type, level) {
    try {
      const config = this.getBoostConfig(type, level);
      if (!config) {
        return { success: false, error: "Invalid boost type or level" };
      }
      const user = await import_UserDB.UserDB.getUser(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }
      if (user.points < config.cost) {
        return { success: false, error: "Not enough points" };
      }
      if (Array.isArray(BOOST_CONFIG[type]) && level > 1) {
        const hasPreviousLevel = await import_UserDB.UserDB.hasPreviousLevelBoost(userId, type, level);
        if (!hasPreviousLevel) {
          return { success: false, error: "You need to unlock the previous level first" };
        }
      }
      const hasBoost = await import_UserDB.UserDB.hasBoost(userId, type, level);
      if (hasBoost) {
        return { success: false, error: "Boost already unlocked" };
      }
      const boost = {
        id: (0, import_uuid.v4)(),
        type,
        level,
        unlocked: true
      };
      const addedBoost = await import_UserDB.UserDB.addBoost(userId, boost);
      if (!addedBoost) {
        return { success: false, error: "Failed to add boost" };
      }
      await import_UserDB.UserDB.addPoints(userId, -config.cost);
      return { success: true };
    } catch (error) {
      console.error("Error buying boost:", error);
      return { success: false, error: "An error occurred while buying the boost" };
    }
  }
  /**
   * Use a boost
   */
  static async useBoost(userId, type, level) {
    try {
      if (!level && (type === "followX" || type === "rtPost" || type === "connectGenesis" || type === "connectSuperseed")) {
        return await this.useActionBoost(userId, type);
      }
      if (level && (type === "superDistributor" || type === "superAutomator")) {
        return await this.useFeatureBoost(userId, type, level);
      }
      return { success: false, error: "Invalid boost type" };
    } catch (error) {
      console.error("Error using boost:", error);
      return { success: false, error: "An error occurred while using the boost" };
    }
  }
  /**
   * Use an action boost (like followX)
   */
  static async useActionBoost(userId, type) {
    const config = this.getBoostConfig(type);
    if (!config) {
      return { success: false, error: "Invalid boost type" };
    }
    if (config.available === false) {
      return { success: false, error: "This boost is not available yet" };
    }
    const user = await import_UserDB.UserDB.getUser(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    const hasBoost = await import_UserDB.UserDB.hasBoost(userId, type);
    if (hasBoost) {
      return { success: false, error: "Boost already used" };
    }
    if (type === "followX" || type === "rtPost") {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
    }
    const boost = {
      id: (0, import_uuid.v4)(),
      type,
      unlocked: true,
      lastUsed: Date.now()
    };
    const addedBoost = await import_UserDB.UserDB.addBoost(userId, boost);
    if (!addedBoost) {
      return { success: false, error: "Failed to add boost" };
    }
    const reward = typeof config.reward === "number" ? config.reward : 0;
    if (reward > 0) {
      await import_UserDB.UserDB.addPoints(userId, reward);
    }
    return { success: true, reward };
  }
  /**
   * Use a feature boost (like superDistributor)
   */
  static async useFeatureBoost(userId, type, level) {
    const config = this.getBoostConfig(type, level);
    if (!config) {
      return { success: false, error: "Invalid boost type or level" };
    }
    const user = await import_UserDB.UserDB.getUser(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    const hasBoost = await import_UserDB.UserDB.hasBoost(userId, type, level);
    if (!hasBoost) {
      return { success: false, error: "Boost not unlocked" };
    }
    const boost = await import_UserDB.UserDB.getBoost(userId, type, level);
    if (boost?.lastUsed && config.cooldown) {
      const timeSinceLastUse = Date.now() - boost.lastUsed;
      if (timeSinceLastUse < config.cooldown) {
        const remainingTime = Math.ceil((config.cooldown - timeSinceLastUse) / (60 * 1e3));
        return { success: false, error: `Boost on cooldown for another ${remainingTime} minutes` };
      }
    }
    await import_UserDB.UserDB.updateBoostUsage(userId, type, level);
    if (type === "superDistributor") {
      const coinsToDistribute = level * 100;
      await this.distributeCoinsToAllUsers(coinsToDistribute);
    }
    return { success: true };
  }
  /**
   * Distribute coins to all users
   */
  static async distributeCoinsToAllUsers(coinsToDistribute) {
    const redis = import_AppService.AppService.getInstance().getRedisClient();
    const userKeys = await redis.keys("user:*");
    const MAX_COINS = 1e3;
    const BATCH_SIZE = 50;
    let totalDistributed = 0;
    let usersUpdated = 0;
    for (let i = 0; i < userKeys.length; i += BATCH_SIZE) {
      const batchKeys = userKeys.slice(i, i + BATCH_SIZE);
      const pipeline = redis.pipeline();
      const userDataPromises = batchKeys.map((key) => redis.get(key));
      const userDataResults = await Promise.all(userDataPromises);
      for (let j = 0; j < batchKeys.length; j++) {
        const key = batchKeys[j];
        const userData = userDataResults[j];
        if (!userData)
          continue;
        const user = JSON.parse(userData);
        const currentCoins = user.coins || 0;
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
      await pipeline.exec();
    }
    return { usersUpdated, totalDistributed };
  }
  /**
   * Migrate existing boosts to include usageCount (admin utility)
   * This should be called once to update existing users in the database
   */
  static async migrateBoostsToIncludeUsageCount() {
    try {
      const redis = import_AppService.AppService.getInstance().getRedisClient();
      const userKeys = await redis.keys("user:*");
      let usersUpdated = 0;
      for (const key of userKeys) {
        const userData = await redis.get(key);
        if (!userData)
          continue;
        const user = JSON.parse(userData);
        let updated = false;
        if (user.boosts && user.boosts.length > 0) {
          for (const boost of user.boosts) {
            if (boost.usageCount === void 0) {
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
      console.error("Error migrating boosts:", error);
      return { usersUpdated: 0 };
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BoostService
});
