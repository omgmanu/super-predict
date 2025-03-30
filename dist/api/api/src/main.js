var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_hono = require("hono");
var import_node_server = require("@hono/node-server");
var import_cors = require("hono/cors");
var import_AppService = require("./services/AppService");
var import_auth = __toESM(require("./routes/auth"));
var import_games = __toESM(require("./routes/games"));
var import_coins = __toESM(require("./routes/coins"));
var import_game = __toESM(require("./routes/game"));
var import_leaderboard = __toESM(require("./routes/leaderboard"));
var import_boosts = __toESM(require("./routes/boosts"));
var import_automator = __toESM(require("./routes/automator"));
var import_admin = __toESM(require("./routes/admin"));
var import_env = require("./utils/env");
var import_session = require("./utils/session");
const app = new import_hono.Hono();
app.use(
  "/*",
  (0, import_cors.cors)({
    origin: import_env.env.CLIENT_URL,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600
  })
);
app.use("/*", import_session.session);
app.get("/", (c) => {
  return c.json({ message: "Welcome to Super Predict API" });
});
const api = new import_hono.Hono();
api.route("/auth", import_auth.default);
api.route("/games", import_games.default);
api.route("/coins", import_coins.default);
api.route("/game", import_game.default);
api.route("/leaderboard", import_leaderboard.default);
api.route("/boosts", import_boosts.default);
api.route("/automator", import_automator.default);
api.route("/admin", import_admin.default);
app.route("/api", api);
const init = async () => {
  try {
    await import_AppService.AppService.getInstance().init();
    console.log(`Starting server on http://${import_env.env.HOST}:${import_env.env.PORT}`);
    (0, import_node_server.serve)({
      fetch: app.fetch,
      port: import_env.env.PORT,
      hostname: import_env.env.HOST
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
};
const shutdown = async () => {
  try {
    await import_AppService.AppService.getInstance().cleanup();
    console.log("Application shutdown gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
init();
