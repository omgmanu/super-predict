var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var games_exports = {};
__export(games_exports, {
  default: () => games_default
});
module.exports = __toCommonJS(games_exports);
var import_hono = require("hono");
var import_GameDB = require("../db/GameDB");
var import_UserDB = require("../db/UserDB");
var import_auth = require("../utils/auth");
var import_crypto = __toESM(require("crypto"));
function generateId() {
  return import_crypto.default.randomBytes(6).toString("hex");
}
const games = new import_hono.Hono();
games.post("/new", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    const { betAmount, prediction, priceAtStart } = body;
    if (!betAmount || !prediction || !priceAtStart) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }
    if (user.points < betAmount) {
      return c.json({ success: false, error: "Not enough points" }, 400);
    }
    await import_UserDB.UserDB.updatePoints(user.id, user.points - betAmount);
    const gameId = generateId();
    const game = {
      id: gameId,
      userId: user.id,
      status: "pending",
      startTime: Date.now(),
      endTime: Date.now() + 24 * 60 * 60 * 1e3,
      // 24 hours later
      betAmount,
      priceAtStart,
      priceAtEnd: null,
      prediction,
      result: null,
      pointsWon: null
    };
    await import_GameDB.GameDB.createGame(game);
    return c.json({ success: true, data: game });
  } catch (error) {
    console.error("Error creating game:", error);
    return c.json({ success: false, error: "Failed to create game" }, 500);
  }
});
games.get("/", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const games2 = await import_GameDB.GameDB.getUserGames(user.id);
    return c.json({ success: true, data: games2 });
  } catch (error) {
    console.error("Error fetching games:", error);
    return c.json({ success: false, error: "Failed to fetch games" }, 500);
  }
});
games.get("/:id", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const gameId = c.req.param("id");
    const game = await import_GameDB.GameDB.getGame(gameId, user.id);
    if (!game) {
      return c.json({ success: false, error: "Game not found" }, 404);
    }
    return c.json({ success: true, data: game });
  } catch (error) {
    console.error("Error fetching game:", error);
    return c.json({ success: false, error: "Failed to fetch game" }, 500);
  }
});
games.get("/recent/wins", async (c) => {
  try {
    const limitParam = c.req.query("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    if (isNaN(limit) || limit <= 0) {
      return c.json({
        success: false,
        error: "Limit must be a positive number"
      }, 400);
    }
    const recentGames = await import_GameDB.GameDB.getRecentWinningGames(limit);
    const gamesWithUsernames = await Promise.all(
      recentGames.map(async (game) => {
        const user = await import_UserDB.UserDB.getUser(game.userId);
        return {
          ...game,
          username: user ? user.username : "Unknown"
        };
      })
    );
    return c.json({ success: true, data: gamesWithUsernames });
  } catch (error) {
    console.error("Error fetching recent games:", error);
    return c.json({ success: false, error: "Failed to fetch recent games" }, 500);
  }
});
var games_default = games;
