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
var UserDB_exports = {};
__export(UserDB_exports, {
  UserDB: () => UserDB
});
module.exports = __toCommonJS(UserDB_exports);
var import_AppService = require("../services/AppService");
const USER_PREFIX = "user";
class UserDB {
  static getRedisClient() {
    return import_AppService.AppService.getInstance().getRedisClient();
  }
  /**
   * Create or update a user in Redis
   */
  static async saveUser(user) {
    const redis = this.getRedisClient();
    const key = `${USER_PREFIX}:${user.id}`;
    await redis.set(key, JSON.stringify(user));
  }
  /**
   * Get a user by ID
   */
  static async getUser(userId) {
    const redis = this.getRedisClient();
    const key = `${USER_PREFIX}:${userId}`;
    const userData = await redis.get(key);
    if (!userData) {
      return null;
    }
    return JSON.parse(userData);
  }
  /**
   * Delete a user by ID
   */
  static async deleteUser(userId) {
    const redis = this.getRedisClient();
    const key = `${USER_PREFIX}:${userId}`;
    const deleted = await redis.del(key);
    return deleted > 0;
  }
  /**
   * Update user points
   */
  static async updatePoints(userId, points) {
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
  static async addPoints(userId, pointsToAdd) {
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
  static async updateCoins(userId, coins) {
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
  static async addCoins(userId, coinsToAdd) {
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
  static async deductCoins(userId, coinsToDeduct) {
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
  static async getLeaderboard(limit = 100) {
    const redis = this.getRedisClient();
    const pattern = `${USER_PREFIX}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length === 0) {
      return [];
    }
    const usersData = await redis.mget(...keys);
    const users = usersData.filter((data) => data !== null).map((data) => JSON.parse(data));
    return users.sort((a, b) => b.points - a.points).slice(0, limit);
  }
  /**
   * Add or update a boost for a user
   */
  static async addBoost(userId, boost) {
    const user = await this.getUser(userId);
    if (!user) {
      return false;
    }
    if (!user.boosts) {
      user.boosts = [];
    }
    if (boost.usageCount === void 0) {
      boost.usageCount = 0;
    }
    const existingBoostIndex = user.boosts.findIndex(
      (b) => b.type === boost.type && (boost.level === void 0 || b.level === boost.level)
    );
    if (existingBoostIndex >= 0) {
      if (user.boosts[existingBoostIndex].usageCount !== void 0) {
        boost.usageCount = user.boosts[existingBoostIndex].usageCount;
      }
      user.boosts[existingBoostIndex] = boost;
    } else {
      user.boosts.push(boost);
    }
    await this.saveUser(user);
    return true;
  }
  /**
   * Get a specific boost for a user
   */
  static async getBoost(userId, boostType, level) {
    const user = await this.getUser(userId);
    if (!user || !user.boosts) {
      return null;
    }
    const boost = user.boosts.find(
      (b) => b.type === boostType && (level === void 0 || b.level === level)
    );
    return boost || null;
  }
  /**
   * Check if user has a specific boost
   */
  static async hasBoost(userId, boostType, level) {
    const boost = await this.getBoost(userId, boostType, level);
    return !!boost && boost.unlocked;
  }
  /**
   * Check if user has previous level of a boost
   */
  static async hasPreviousLevelBoost(userId, boostType, level) {
    if (level === 1) {
      return true;
    }
    return await this.hasBoost(userId, boostType, level - 1);
  }
  /**
   * Update last used timestamp for a boost
   */
  static async updateBoostUsage(userId, boostType, level) {
    const user = await this.getUser(userId);
    if (!user || !user.boosts) {
      return false;
    }
    const boostIndex = user.boosts.findIndex(
      (b) => b.type === boostType && (level === void 0 || b.level === level)
    );
    if (boostIndex === -1) {
      return false;
    }
    user.boosts[boostIndex].lastUsed = Date.now();
    if (boostType === "superDistributor") {
      user.boosts[boostIndex].usageCount = (user.boosts[boostIndex].usageCount || 0) + 1;
    }
    await this.saveUser(user);
    return true;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserDB
});
