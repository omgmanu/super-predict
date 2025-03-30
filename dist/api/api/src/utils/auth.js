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
  getCurrentUser: () => getCurrentUser,
  requireAuth: () => requireAuth
});
module.exports = __toCommonJS(auth_exports);
var import_UserDB = require("../db/UserDB");
var import_session = require("./session");
const getCurrentUser = async (c) => {
  if (!import_session.sessions.isAuthenticated(c)) {
    return null;
  }
  const userId = import_session.sessions.getUserId(c);
  if (!userId) {
    return null;
  }
  return await import_UserDB.UserDB.getUser(userId);
};
const requireAuth = async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    c.status(401);
    return null;
  }
  return user;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCurrentUser,
  requireAuth
});
