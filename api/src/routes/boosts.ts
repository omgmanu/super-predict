import { Hono } from 'hono';
import { BoostService } from '../services/BoostService';
import { requireAuth } from '../utils/auth';

const boosts = new Hono();

// Buy a boost
boosts.post('/buy', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { type, level } = body;
    
    if (!type || !level) {
      return c.json({ success: false, error: 'Missing required parameters' }, 400);
    }
    
    const result = await BoostService.buyBoost(user.id, type, level);
    
    if (!result.success) {
      return c.json({ success: false, error: result.error }, 400);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error buying boost:', error);
    return c.json({ success: false, error: 'An error occurred' }, 500);
  }
});

// Use a boost
boosts.post('/use', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { type, level } = body;
    
    if (!type) {
      return c.json({ success: false, error: 'Missing required parameters' }, 400);
    }
    
    // Log the request for debugging
    console.log(`Boost use request from user ${user.id}: type=${type}, level=${level || 'N/A'}`);
    
    const result = await BoostService.useBoost(user.id, type, level);
    
    // Log the result for debugging
    console.log(`Boost use result: ${JSON.stringify(result)}`);
    
    if (!result.success) {
      return c.json({ success: false, error: result.error }, 400);
    }
    
    // If it's an action boost with a reward, include it in the response
    if (result.reward !== undefined) {
      return c.json({ 
        success: true, 
        data: { 
          reward: result.reward 
        } 
      });
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error using boost:', error);
    return c.json({ success: false, error: 'An error occurred' }, 500);
  }
});

// Get all boosts for the current user
boosts.get('/', async (c) => {
  try {
    const user = await requireAuth(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    // Return the user's boosts
    return c.json({ 
      success: true, 
      data: user.boosts || [] 
    });
  } catch (error) {
    console.error('Error getting boosts:', error);
    return c.json({ success: false, error: 'An error occurred' }, 500);
  }
});

export default boosts; 