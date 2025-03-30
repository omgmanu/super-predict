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
var leaderboard_exports = {};
__export(leaderboard_exports, {
  default: () => leaderboard_default
});
module.exports = __toCommonJS(leaderboard_exports);
var import_hono = require("hono");
var import_UserDB = require("../db/UserDB");
const leaderboard = new import_hono.Hono();
leaderboard.get("/", async (c) => {
  try {
    const limitParam = c.req.query("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 100;
    if (isNaN(limit) || limit <= 0) {
      return c.json({
        success: false,
        error: "Limit must be a positive number"
      }, 400);
    }
    const users = await import_UserDB.UserDB.getLeaderboard(limit);
    const leaderboardData = users.map((user, index) => {
      const winRate = user.gamesPlayed > 0 ? (user.gamesWon / user.gamesPlayed * 100).toFixed(1) + "%" : "0%";
      return {
        rank: index + 1,
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        points: user.points,
        gamesPlayed: user.gamesPlayed || 0,
        winRate,
        boosts: user.boosts || []
      };
    });
    return c.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return c.json({ success: false, error: "Failed to fetch leaderboard" }, 500);
  }
});
var leaderboard_default = leaderboard;
