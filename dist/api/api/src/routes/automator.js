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
var automator_exports = {};
__export(automator_exports, {
  default: () => automator_default
});
module.exports = __toCommonJS(automator_exports);
var import_hono = require("hono");
var import_env = require("../utils/env");
var import_AutomatorService = require("../services/AutomatorService");
const automator = new import_hono.Hono();
const verifyCronAuth = async (c, next) => {
  const cronAuthHeader = c.req.header("cron-auth");
  if (!cronAuthHeader || cronAuthHeader !== import_env.env.CRON_AUTH_KEY) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }
  await next();
};
automator.post("/run", verifyCronAuth, async (c) => {
  try {
    const result = await import_AutomatorService.AutomatorService.runAutomator();
    return c.json({
      success: true,
      data: {
        gamesCreated: result.gamesCreated
      }
    });
  } catch (error) {
    console.error("Error running automator:", error);
    return c.json({
      success: false,
      error: "Failed to run automator"
    }, 500);
  }
});
var automator_default = automator;
