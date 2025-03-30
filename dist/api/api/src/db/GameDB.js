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
var GameDB_exports = {};
__export(GameDB_exports, {
  GameDB: () => GameDB
});
module.exports = __toCommonJS(GameDB_exports);
var import_AppService = require("../services/AppService");
const GAME_PREFIX = "game";
class GameDB {
  static getRedisClient() {
    return import_AppService.AppService.getInstance().getRedisClient();
  }
  /**
   * Create a new game in Redis
   */
  static async createGame(game) {
    const redis = this.getRedisClient();
    const key = `${GAME_PREFIX}:${game.id}:${game.userId}:${game.status}`;
    await redis.set(key, JSON.stringify(game));
  }
  /**
   * Get a game by ID
   */
  static async getGame(gameId, userId) {
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
    return JSON.parse(gameData);
  }
  /**
   * Update a game's status and other fields
   */
  static async updateGame(game) {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:${game.id}:${game.userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    const newKey = `${GAME_PREFIX}:${game.id}:${game.userId}:${game.status}`;
    await redis.set(newKey, JSON.stringify(game));
    return true;
  }
  /**
   * Get all games for a user
   */
  static async getUserGames(userId) {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:*:${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length === 0) {
      return [];
    }
    const gamesData = await redis.mget(...keys);
    return gamesData.filter((data) => data !== null).map((data) => JSON.parse(data));
  }
  /**
   * Get all games with a specific status
   */
  static async getGamesByStatus(status) {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:*:*:${status}`;
    const keys = await redis.keys(pattern);
    if (keys.length === 0) {
      return [];
    }
    const gamesData = await redis.mget(...keys);
    return gamesData.filter((data) => data !== null).map((data) => JSON.parse(data));
  }
  /**
   * Find pending games for a user
   */
  static async getPendingGameForUser(userId) {
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
    return JSON.parse(gameData);
  }
  /**
   * Get recent completed games with 'win' result
   * Returns the most recently completed games
   */
  static async getRecentWinningGames(limit = 10) {
    const redis = this.getRedisClient();
    const pattern = `${GAME_PREFIX}:*:*:settled`;
    const keys = await redis.keys(pattern);
    if (keys.length === 0) {
      return [];
    }
    const gamesData = await redis.mget(...keys);
    const games = gamesData.filter((data) => data !== null).map((data) => JSON.parse(data)).filter((game) => game.result === "win");
    return games.sort((a, b) => (b.endTime || 0) - (a.endTime || 0)).slice(0, limit);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GameDB
});
