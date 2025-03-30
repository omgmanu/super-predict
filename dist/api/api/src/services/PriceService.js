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
var PriceService_exports = {};
__export(PriceService_exports, {
  PriceService: () => PriceService
});
module.exports = __toCommonJS(PriceService_exports);
var import_axios = __toESM(require("axios"));
const ETH_PRICE_FEED_ID = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
class PriceService {
  /**
   * Fetches the ETH price at a specific timestamp from Pyth's Hermes API
   * Tries multiple timestamp offsets if needed
   * @param timestamp Unix timestamp in seconds
   * @returns The ETH price as a number
   */
  static async fetchEthPrice(timestamp) {
    const offsets = [10, 30, 60, 100, 200];
    for (const offset of offsets) {
      try {
        const adjustedTimestamp = timestamp - offset;
        const feedId = encodeURIComponent(ETH_PRICE_FEED_ID);
        const url = `https://hermes.pyth.network/v2/updates/price/${adjustedTimestamp}?ids[]=${feedId}&parsed=true`;
        console.log(`Trying to fetch ETH price with offset -${offset}s:`, url);
        const response = await import_axios.default.get(url);
        if (response.status !== 200) {
          console.warn(`API returned status ${response.status} with offset -${offset}s, trying next offset...`);
          continue;
        }
        const data = response.data;
        if (!data.parsed || data.parsed.length === 0) {
          console.warn(`No price data found in response with offset -${offset}s, trying next offset...`);
          continue;
        }
        const priceData = data.parsed[0].price;
        const price = priceData.price;
        const expo = priceData.expo;
        const actualPrice = Number(price) * Math.pow(10, expo);
        console.log(`Successfully fetched ETH price with offset -${offset}s: $${actualPrice}`);
        return actualPrice;
      } catch (error) {
        console.warn(`Error fetching ETH price with offset -${offset}s:`, error);
      }
    }
    throw new Error("Failed to fetch ETH price after trying multiple timestamp offsets");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PriceService
});
