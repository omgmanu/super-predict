import { Hono } from 'hono';
import { env } from '../utils/env';
import { AppService } from '../services/AppService';

const coins = new Hono();

// Middleware to verify cron authentication
const verifyCronAuth = async (c: any, next: any) => {
  const authKey = c.req.query('authKey');
  
  if (!authKey || authKey !== env.CRON_AUTH_KEY) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  await next();
};

// Distribute coins to all users
coins.get('/distribute', verifyCronAuth, async (c) => {
  try {
    const redis = AppService.getInstance().getRedisClient();
    const userKeys = await redis.keys('user:*');
    
    const COINS_TO_DISTRIBUTE = 100;
    const MAX_COINS = 1000;
    const BATCH_SIZE = 50;
    let totalDistributed = 0;
    let usersUpdated = 0;
    
    // Process users in batches
    for (let i = 0; i < userKeys.length; i += BATCH_SIZE) {
      const batchKeys = userKeys.slice(i, i + BATCH_SIZE);
      const pipeline = redis.pipeline();
      
      // Get all users in the batch
      const userDataPromises = batchKeys.map(key => redis.get(key));
      const userDataResults = await Promise.all(userDataPromises);
      
      // Process each user in the batch
      for (let j = 0; j < batchKeys.length; j++) {
        const key = batchKeys[j];
        const userData = userDataResults[j];
        
        if (!userData) continue;
        
        const user = JSON.parse(userData);
        const currentCoins = user.coins || 0;
        
        // Calculate how many coins to add
        const coinsToAdd = Math.min(
          COINS_TO_DISTRIBUTE,
          MAX_COINS - currentCoins
        );
        
        if (coinsToAdd > 0) {
          user.coins = currentCoins + coinsToAdd;
          pipeline.set(key, JSON.stringify(user));
          totalDistributed += coinsToAdd;
          usersUpdated++;
        }
      }
      
      // Execute the batch update
      await pipeline.exec();
    }
    
    return c.json({
      success: true,
      data: {
        totalDistributed,
        usersUpdated
      }
    });
  } catch (error) {
    console.error('Error distributing coins:', error);
    return c.json({
      success: false,
      error: 'Failed to distribute coins'
    }, 500);
  }
});

export default coins; 