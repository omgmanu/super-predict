// Using axios for HTTP requests
import axios from 'axios';

// ETH price feed ID on Pyth
const ETH_PRICE_FEED_ID = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

interface PriceResponse {
  binary: {
    encoding: string;
    data: string[];
  };
  parsed: {
    id: string;
    price: {
      price: string;
      conf: string;
      expo: number;
      publish_time: number;
    };
    ema_price: {
      price: string;
      conf: string;
      expo: number;
      publish_time: number;
    };
    metadata: {
      slot: number;
      proof_available_time: number;
      prev_publish_time: number;
    };
  }[];
}

export class PriceService {
  /**
   * Fetches the ETH price at a specific timestamp from Pyth's Hermes API
   * Tries multiple timestamp offsets if needed
   * @param timestamp Unix timestamp in seconds
   * @returns The ETH price as a number
   */
  public static async fetchEthPrice(timestamp: number): Promise<number> {
    // Try with increasing offsets (in seconds)
    const offsets = [10, 30, 60, 100, 200];
    
    for (const offset of offsets) {
      try {
        // Adjust timestamp to be in the past to ensure data availability
        const adjustedTimestamp = timestamp - offset;
        
        // Properly encode the URL parameters
        const feedId = encodeURIComponent(ETH_PRICE_FEED_ID);
        const url = `https://hermes.pyth.network/v2/updates/price/${adjustedTimestamp}?ids[]=${feedId}&parsed=true`;
        
        console.log(`Trying to fetch ETH price with offset -${offset}s:`, url);
        const response = await axios.get<PriceResponse>(url);
        
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
        
        // Calculate the actual price by applying the exponent
        // If expo is -8, we need to divide by 10^8
        const actualPrice = Number(price) * Math.pow(10, expo);
        
        console.log(`Successfully fetched ETH price with offset -${offset}s: $${actualPrice}`);
        return actualPrice;
      } catch (error) {
        console.warn(`Error fetching ETH price with offset -${offset}s:`, error);
        // Continue with next offset
      }
    }
    
    // If all offsets failed, throw an error
    throw new Error('Failed to fetch ETH price after trying multiple timestamp offsets');
  }
} 