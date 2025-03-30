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
var admin_exports = {};
__export(admin_exports, {
  default: () => admin_default
});
module.exports = __toCommonJS(admin_exports);
var import_hono = require("hono");
var import_adapter = require("hono/adapter");
var import_BoostService = require("../services/BoostService");
const admin = new import_hono.Hono();
const requireAdminAuth = async (c) => {
  const adminKey = c.req.header("admin-key");
  const { ADMIN_KEY } = (0, import_adapter.env)(c);
  if (!adminKey || adminKey !== ADMIN_KEY) {
    return { success: false };
  }
  return { success: true };
};
admin.post("/migrate-boosts", async (c) => {
  try {
    const authResult = await requireAdminAuth(c);
    if (!authResult.success) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const result = await import_BoostService.BoostService.migrateBoostsToIncludeUsageCount();
    return c.json({
      success: true,
      data: {
        usersUpdated: result.usersUpdated,
        message: `Successfully migrated boosts for ${result.usersUpdated} users`
      }
    });
  } catch (error) {
    console.error("Error migrating boosts:", error);
    return c.json({ success: false, error: "An error occurred during migration" }, 500);
  }
});
var admin_default = admin;
