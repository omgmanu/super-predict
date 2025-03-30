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
var AuthService_exports = {};
__export(AuthService_exports, {
  AuthService: () => AuthService
});
module.exports = __toCommonJS(AuthService_exports);
var import_AppService = require("./AppService");
var import_UserDB = require("../db/UserDB");
class AuthService {
  static getRedisClient() {
    return import_AppService.AppService.getInstance().getRedisClient();
  }
  /**
   * Create or get user from X (Twitter) OAuth data
   */
  static async createOrGetUserFromX(xUser) {
    const existingUser = await import_UserDB.UserDB.getUser(xUser.id);
    if (existingUser) {
      existingUser.username = xUser.username;
      existingUser.profileImageUrl = xUser.profile_image_url;
      await import_UserDB.UserDB.saveUser(existingUser);
      return existingUser;
    }
    const newUser = {
      id: xUser.id,
      // Using X's ID as the user ID
      username: xUser.username,
      profileImageUrl: xUser.profile_image_url,
      points: 0,
      coins: 100,
      // Start with 100 coins
      gamesPlayed: 0,
      gamesWon: 0
    };
    await import_UserDB.UserDB.saveUser(newUser);
    return newUser;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthService
});
