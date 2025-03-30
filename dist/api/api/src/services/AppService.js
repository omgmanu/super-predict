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
var AppService_exports = {};
__export(AppService_exports, {
  AppService: () => AppService
});
module.exports = __toCommonJS(AppService_exports);
var import_ioredis = require("ioredis");
var import_env = require("../utils/env");
class AppService {
  constructor() {
    this.redisClient = null;
  }
  /**
   * Get the singleton instance of AppService
   */
  static getInstance() {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }
  /**
   * Initialize the app service
   */
  async init() {
    await this.connectToRedis();
  }
  /**
   * Connect to Redis using environment variables
   */
  async connectToRedis() {
    try {
      this.redisClient = new import_ioredis.Redis(import_env.env.REDIS_URL);
      console.log("Successfully connected to Redis");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }
  /**
   * Get the Redis client
   */
  getRedisClient() {
    if (!this.redisClient) {
      throw new Error("Redis client not initialized. Call init() first.");
    }
    return this.redisClient;
  }
  /**
   * Cleanup resources when shutting down
   */
  async cleanup() {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.redisClient = null;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppService
});
