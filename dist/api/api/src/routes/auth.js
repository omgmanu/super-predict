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
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
var import_hono = require("hono");
var import_AuthService = require("../services/AuthService");
var import_factory = require("hono/factory");
var import_x = require("@hono/oauth-providers/x");
var import_env = require("../utils/env");
var import_session = require("../utils/session");
var import_auth = require("../utils/auth");
const auth = new import_hono.Hono();
const authMiddleware = (0, import_factory.createMiddleware)(async (c, next) => {
  const user = await (0, import_auth.requireAuth)(c);
  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }
  c.set("user", user);
  await next();
});
auth.use(
  "/x/*",
  (0, import_x.xAuth)({
    client_id: import_env.env.TWITTER_CLIENT_ID,
    client_secret: import_env.env.TWITTER_CLIENT_SECRET,
    redirect_uri: import_env.env.TWITTER_REDIRECT_URI,
    scope: ["users.read", "tweet.read"],
    fields: ["profile_image_url", "username"]
  })
);
auth.get("/x/callback", async (c) => {
  const xUser = c.get("user-x");
  console.log("xUser", xUser);
  if (!xUser) {
    return c.json({ success: false, error: "Authentication failed" }, 401);
  }
  try {
    const user = await import_AuthService.AuthService.createOrGetUserFromX(xUser);
    await import_session.sessions.setAuthenticatedUser(c, user.id);
    return c.redirect(`${import_env.env.CLIENT_URL}/play`);
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ success: false, error: "Authentication failed" }, 500);
  }
});
auth.get("/me", authMiddleware, (c) => {
  const user = c.get("user");
  return c.json({ success: true, data: user });
});
auth.post("/logout", async (c) => {
  await import_session.sessions.clearSession(c);
  return c.json({ success: true });
});
var auth_default = auth;
