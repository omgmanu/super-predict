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
var AutomatorService_exports = {};
__export(AutomatorService_exports, {
  AutomatorService: () => AutomatorService
});
module.exports = __toCommonJS(AutomatorService_exports);
var import_UserDB = require("../db/UserDB");
var import_GameDB = require("../db/GameDB");
var import_BoostService = require("./BoostService");
var import_PriceService = require("./PriceService");
var import_AppService = require("./AppService");
var import_uuid = require("uuid");
class AutomatorService {
  /**
   * Run the automator for all users with active Super Automator boosts
   */
  static async runAutomator() {
    try {
      const redis = import_AppService.AppService.getInstance().getRedisClient();
      const userKeys = await redis.keys("user:*");
      let gamesCreated = 0;
      for (const key of userKeys) {
        const userData = await redis.get(key);
        if (!userData)
          continue;
        const user = JSON.parse(userData);
        if (!user.boosts || user.boosts.length === 0)
          continue;
        let highestAutomatorBoost = null;
        for (const boost of user.boosts) {
          if (boost.type === "superAutomator" && boost.unlocked) {
            if (!highestAutomatorBoost || boost.level && highestAutomatorBoost.level && boost.level > highestAutomatorBoost.level) {
              highestAutomatorBoost = boost;
            }
          }
        }
        if (!highestAutomatorBoost)
          continue;
        const boostConfig = import_BoostService.BoostService.getBoostConfig("superAutomator", highestAutomatorBoost.level);
        if (!boostConfig || !boostConfig.cooldown)
          continue;
        const lastUsed = highestAutomatorBoost.lastUsed || 0;
        const timeSinceLastUse = Date.now() - lastUsed;
        if (timeSinceLastUse >= boostConfig.cooldown) {
          if (user.coins < 100)
            continue;
          const game = await this.createAutomatedGame(user.id);
          if (game) {
            gamesCreated++;
            await import_UserDB.UserDB.updateBoostUsage(user.id, "superAutomator", highestAutomatorBoost.level);
          }
        }
      }
      return { success: true, gamesCreated };
    } catch (error) {
      console.error("Error running automator:", error);
      return { success: false, gamesCreated: 0 };
    }
  }
  /**
   * Create an automated game for a user
   */
  static async createAutomatedGame(userId) {
    try {
      const user = await import_UserDB.UserDB.getUser(userId);
      if (!user)
        return null;
      if (user.coins < 100)
        return null;
      const deducted = await import_UserDB.UserDB.deductCoins(userId, 100);
      if (!deducted)
        return null;
      const currentPrice = await this.getCurrentPrice();
      if (!currentPrice)
        return null;
      const prediction = Math.random() > 0.5 ? "long" : "short";
      const game = {
        id: (0, import_uuid.v4)(),
        userId,
        status: "pending",
        startTime: Date.now(),
        endTime: null,
        betAmount: 100,
        priceAtStart: currentPrice,
        priceAtEnd: null,
        prediction,
        result: null,
        pointsWon: null
      };
      await import_GameDB.GameDB.createGame(game);
      setTimeout(() => {
        this.settleAutomatedGame(game.id, userId);
      }, 6e4);
      return game;
    } catch (error) {
      console.error("Error creating automated game:", error);
      return null;
    }
  }
  /**
   * Settle an automated game
   */
  static async settleAutomatedGame(gameId, userId) {
    try {
      const game = await import_GameDB.GameDB.getGame(gameId, userId);
      if (!game || game.status !== "pending")
        return;
      const currentPrice = await this.getCurrentPrice();
      if (!currentPrice)
        return;
      const priceChange = currentPrice - game.priceAtStart;
      let result = "loss";
      if (game.prediction === "long" && priceChange > 0 || game.prediction === "short" && priceChange < 0) {
        result = "win";
      }
      const pointsWon = result === "win" ? game.betAmount * 2 : Math.floor(game.betAmount * 0.1);
      game.status = "settled";
      game.endTime = Date.now();
      game.priceAtEnd = currentPrice;
      game.result = result;
      game.pointsWon = pointsWon;
      await import_GameDB.GameDB.updateGame(game);
      await import_UserDB.UserDB.addPoints(userId, pointsWon);
      const user = await import_UserDB.UserDB.getUser(userId);
      if (user) {
        user.gamesPlayed = (user.gamesPlayed || 0) + 1;
        if (result === "win") {
          user.gamesWon = (user.gamesWon || 0) + 1;
        }
        await import_UserDB.UserDB.saveUser(user);
      }
    } catch (error) {
      console.error("Error settling automated game:", error);
    }
  }
  /**
   * Get current ETH price
   * This is a helper method that uses PriceService.fetchEthPrice
   */
  static async getCurrentPrice() {
    try {
      const timestamp = Math.floor(Date.now() / 1e3);
      return await import_PriceService.PriceService.fetchEthPrice(timestamp);
    } catch (error) {
      console.error("Error getting current ETH price:", error);
      return 0;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutomatorService
});
