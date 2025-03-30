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
var game_exports = {};
__export(game_exports, {
  default: () => game_default
});
module.exports = __toCommonJS(game_exports);
var import_hono = require("hono");
var import_GameDB = require("../db/GameDB");
var import_UserDB = require("../db/UserDB");
var import_auth = require("../utils/auth");
var import_PriceService = require("../services/PriceService");
var import_crypto = __toESM(require("crypto"));
function generateId() {
  return import_crypto.default.randomBytes(6).toString("hex");
}
const game = new import_hono.Hono();
async function completeGame(gameId, userId, endTime) {
  const endTimestamp = endTime ? endTime : Math.floor(Date.now() / 1e3);
  try {
    const currentGame = await import_GameDB.GameDB.getGame(gameId, userId);
    if (!currentGame || currentGame.status !== "pending") {
      console.log(`Game ${gameId} is no longer pending or doesn't exist.`);
      return;
    }
    let priceAtEnd;
    try {
      priceAtEnd = await import_PriceService.PriceService.fetchEthPrice(endTimestamp);
    } catch (error) {
      console.error(`Error fetching ETH price for game ${gameId}:`, error);
      setTimeout(() => {
        console.log(`Retrying to fetch price for game ${gameId} after failure`);
        completeGame(gameId, userId, endTimestamp);
      }, 10 * 1e3);
      return;
    }
    console.log(`Game ${gameId} - Start Price: ${currentGame.priceAtStart}, End Price: ${priceAtEnd}`);
    let result;
    if (Math.abs(priceAtEnd - currentGame.priceAtStart) < 1e-4) {
      const randomOutcome = Math.random() > 0.5;
      result = randomOutcome ? "win" : "loss";
      console.log(`Game ${gameId} - Prices nearly identical, randomized result to: ${result}`);
    } else if (currentGame.prediction === "long" && priceAtEnd > currentGame.priceAtStart || currentGame.prediction === "short" && priceAtEnd < currentGame.priceAtStart) {
      result = "win";
    } else {
      result = "loss";
    }
    const pointsWon = result === "win" ? currentGame.betAmount * 2 : Math.floor(currentGame.betAmount * 0.1);
    const updatedGame = {
      ...currentGame,
      status: "settled",
      endTime: Date.now(),
      priceAtEnd,
      result,
      pointsWon
    };
    await import_GameDB.GameDB.updateGame(updatedGame);
    await import_UserDB.UserDB.addPoints(userId, pointsWon);
    const user = await import_UserDB.UserDB.getUser(userId);
    if (user) {
      const gamesPlayed = (user.gamesPlayed || 0) + 1;
      const gamesWon = result === "win" ? (user.gamesWon || 0) + 1 : user.gamesWon || 0;
      await import_UserDB.UserDB.saveUser({
        ...user,
        gamesPlayed,
        gamesWon
      });
    }
    console.log(`Game ${gameId} completed with result: ${result}, points won: ${pointsWon}`);
  } catch (error) {
    console.error(`Error completing game ${gameId}:`, error);
  }
}
game.post("/new", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const pendingGame = await import_GameDB.GameDB.getPendingGameForUser(user.id);
    if (pendingGame) {
      return c.json({
        success: false,
        error: "You already have a game in progress. Please wait for it to complete."
      }, 400);
    }
    const body = await c.req.json();
    const { betAmount, prediction } = body;
    if (!betAmount || typeof betAmount !== "number" || ![100, 200, 300, 400, 500].includes(betAmount)) {
      return c.json({
        success: false,
        error: "Bet amount must be one of: 100, 200, 300, 400, or 500 coins"
      }, 400);
    }
    if (!prediction || !["long", "short"].includes(prediction)) {
      return c.json({
        success: false,
        error: 'Prediction must be either "long" or "short"'
      }, 400);
    }
    if (user.coins < betAmount) {
      return c.json({
        success: false,
        error: "Not enough coins"
      }, 400);
    }
    const timestamp = Math.floor(Date.now() / 1e3);
    let priceAtStart;
    try {
      priceAtStart = await import_PriceService.PriceService.fetchEthPrice(timestamp);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return c.json({
        success: false,
        error: "Failed to fetch current ETH price. Please try again."
      }, 500);
    }
    await import_UserDB.UserDB.deductCoins(user.id, betAmount);
    const gameId = generateId();
    const startTime = Date.now();
    const game2 = {
      id: gameId,
      userId: user.id,
      status: "pending",
      startTime,
      endTime: null,
      betAmount,
      priceAtStart,
      priceAtEnd: null,
      prediction,
      result: null,
      pointsWon: null
    };
    await import_GameDB.GameDB.createGame(game2);
    setTimeout(() => completeGame(gameId, user.id), 60 * 1e3);
    return c.json({ success: true, data: game2 });
  } catch (error) {
    console.error("Error creating game:", error);
    return c.json({ success: false, error: "Failed to create game" }, 500);
  }
});
game.get("/:id", async (c) => {
  try {
    const user = await (0, import_auth.requireAuth)(c);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const gameId = c.req.param("id");
    const game2 = await import_GameDB.GameDB.getGame(gameId, user.id);
    if (!game2) {
      return c.json({ success: false, error: "Game not found" }, 404);
    }
    let timeLeft = null;
    if (game2.status === "pending") {
      const elapsedTime = Date.now() - game2.startTime;
      const timeLeftMs = Math.max(0, 60 * 1e3 - elapsedTime);
      timeLeft = Math.ceil(timeLeftMs / 1e3);
    }
    return c.json({
      success: true,
      data: {
        ...game2,
        timeLeft
      }
    });
  } catch (error) {
    console.error("Error fetching game:", error);
    return c.json({ success: false, error: "Failed to fetch game" }, 500);
  }
});
var game_default = game;
