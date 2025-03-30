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
var coins_exports = {};
__export(coins_exports, {
  default: () => coins_default
});
module.exports = __toCommonJS(coins_exports);
var import_hono = require("hono");
var import_env = require("../utils/env");
var import_AppService = require("../services/AppService");
const coins = new import_hono.Hono();
const verifyCronAuth = async (c, next) => {
  const cronAuthHeader = c.req.header("cron-auth");
  if (!cronAuthHeader || cronAuthHeader !== import_env.env.CRON_AUTH_KEY) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }
  await next();
};
coins.post("/distribute", verifyCronAuth, async (c) => {
  try {
    const redis = import_AppService.AppService.getInstance().getRedisClient();
    const userKeys = await redis.keys("user:*");
    const COINS_TO_DISTRIBUTE = 100;
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
          COINS_TO_DISTRIBUTE,
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
    return c.json({
      success: true,
      data: {
        totalDistributed,
        usersUpdated
      }
    });
  } catch (error) {
    console.error("Error distributing coins:", error);
    return c.json({
      success: false,
      error: "Failed to distribute coins"
    }, 500);
  }
});
var coins_default = coins;
