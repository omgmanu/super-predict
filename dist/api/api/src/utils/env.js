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
var env_exports = {};
__export(env_exports, {
  env: () => env
});
module.exports = __toCommonJS(env_exports);
var import_zod = require("zod");
const envSchema = import_zod.z.object({
  // API Configuration
  HOST: import_zod.z.string().optional(),
  PORT: import_zod.z.string().transform((val) => parseInt(val, 10)).optional(),
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).optional(),
  // Client Configuration
  CLIENT_URL: import_zod.z.string().optional(),
  // Redis Configuration
  REDIS_URL: import_zod.z.string().optional(),
  // Twitter/X OAuth Configuration
  TWITTER_CLIENT_ID: import_zod.z.string().optional(),
  TWITTER_CLIENT_SECRET: import_zod.z.string().optional(),
  TWITTER_REDIRECT_URI: import_zod.z.string().optional(),
  // Session Configuration
  SESSION_ENCRYPTION_KEY: import_zod.z.string().optional(),
  // Cron Authentication Key
  CRON_AUTH_KEY: import_zod.z.string().optional()
});
function validateEnv() {
  const env2 = process.env;
  try {
    return envSchema.parse(env2);
  } catch (error) {
    if (error instanceof import_zod.z.ZodError) {
      const errorMessages = error.errors.map((err) => {
        return `${err.path.join(".")}: ${err.message}`;
      });
      console.error("\u274C Invalid environment variables:");
      console.error(errorMessages.join("\n"));
      console.error("\nCheck your .env file and make sure all required variables are set with correct values.");
    } else {
      console.error("\u274C Unknown error validating environment variables:", error);
    }
    process.exit(1);
  }
}
const env = validateEnv();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env
});
