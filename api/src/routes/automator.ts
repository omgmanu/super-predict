import { Hono } from 'hono';
import { env } from '../utils/env';
import { AutomatorService } from '../services/AutomatorService';

const automator = new Hono();

// Middleware to verify cron authentication
const verifyCronAuth = async (c: any, next: any) => {
  const cronAuthHeader = c.req.header('cron-auth');
  
  if (!cronAuthHeader || cronAuthHeader !== env.CRON_AUTH_KEY) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  await next();
};

// Run automator for all users with active super automator boosts
automator.post('/run', verifyCronAuth, async (c) => {
  try {
    const result = await AutomatorService.runAutomator();
    
    return c.json({
      success: true,
      data: {
        gamesCreated: result.gamesCreated
      }
    });
  } catch (error) {
    console.error('Error running automator:', error);
    return c.json({
      success: false,
      error: 'Failed to run automator'
    }, 500);
  }
});

export default automator; 