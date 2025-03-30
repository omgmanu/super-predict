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
var boosts_exports = {};
__export(boosts_exports, {
  default: () => boosts_default
});
module.exports = __toCommonJS(boosts_exports);
var import_hono = require("hono");
var import_BoostService = require("../services/BoostService");
var import_auth = require("../utils/auth");
const boosts = new import_hono.Hono();
boosts.post("/buy", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    const { type, level } = body;
    if (!type || !level) {
      return c.json({ success: false, error: "Missing required parameters" }, 400);
    }
    const result = await import_BoostService.BoostService.buyBoost(user.id, type, level);
    if (!result.success) {
      return c.json({ success: false, error: result.error }, 400);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error("Error buying boost:", error);
    return c.json({ success: false, error: "An error occurred" }, 500);
  }
});
boosts.post("/use", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    const { type, level } = body;
    if (!type) {
      return c.json({ success: false, error: "Missing required parameters" }, 400);
    }
    const result = await import_BoostService.BoostService.useBoost(user.id, type, level);
    if (!result.success) {
      return c.json({ success: false, error: result.error }, 400);
    }
    if (result.reward) {
      return c.json({
        success: true,
        data: {
          reward: result.reward
        }
      });
    }
    return c.json({ success: true });
  } catch (error) {
    console.error("Error using boost:", error);
    return c.json({ success: false, error: "An error occurred" }, 500);
  }
});
boosts.get("/", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    return c.json({
      success: true,
      data: user.boosts || []
    });
  } catch (error) {
    console.error("Error getting boosts:", error);
    return c.json({ success: false, error: "An error occurred" }, 500);
  }
});
var boosts_default = boosts;
