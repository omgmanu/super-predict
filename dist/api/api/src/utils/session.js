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
var session_exports = {};
__export(session_exports, {
  session: () => session,
  sessions: () => sessions
});
module.exports = __toCommonJS(session_exports);
var import_hono_sessions = require("hono-sessions");
var import_env = require("./env");
const session = (0, import_hono_sessions.sessionMiddleware)({
  store: new import_hono_sessions.CookieStore(),
  encryptionKey: import_env.env.SESSION_ENCRYPTION_KEY,
  // Required for CookieStore
  expireAfterSeconds: 7 * 24 * 60 * 60,
  // 7 days
  cookieOptions: {
    sameSite: "Lax",
    // CSRF protection
    path: "/",
    // Required for the library to work properly
    httpOnly: true,
    // Avoid XSS attacks
    secure: import_env.env.NODE_ENV === "production"
  }
});
const sessions = {
  /**
   * Get user ID from session
   */
  getUserId: (c) => {
    const session2 = c.get("session");
    const userId = session2.get("userId");
    return userId || null;
  },
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (c) => {
    const session2 = c.get("session");
    return !!session2.get("isAuthenticated");
  },
  /**
   * Set authenticated user in session
   */
  setAuthenticatedUser: async (c, userId) => {
    const session2 = c.get("session");
    session2.set("userId", userId);
    session2.set("isAuthenticated", true);
  },
  /**
   * Clear session
   */
  clearSession: async (c) => {
    const session2 = c.get("session");
    session2.set("userId", "");
    session2.set("isAuthenticated", false);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  session,
  sessions
});
