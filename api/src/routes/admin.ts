import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { BoostService } from '../services/BoostService';

const admin = new Hono();

// Admin auth middleware
const requireAdminAuth = async (c: any) => {
  const adminKey = c.req.header('admin-key');
  const { ADMIN_KEY } = env<{ ADMIN_KEY: string }>(c);
  
  if (!adminKey || adminKey !== ADMIN_KEY) {
    return { success: false };
  }
  
  return { success: true };
};

// Migrate boosts to include usageCount property
admin.post('/migrate-boosts', async (c) => {
  try {
    // Authenticate as admin
    const authResult = await requireAdminAuth(c);
    if (!authResult.success) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Run the migration
    const result = await BoostService.migrateBoostsToIncludeUsageCount();
    
    return c.json({ 
      success: true, 
      data: { 
        usersUpdated: result.usersUpdated,
        message: `Successfully migrated boosts for ${result.usersUpdated} users`
      } 
    });
  } catch (error) {
    console.error('Error migrating boosts:', error);
    return c.json({ success: false, error: 'An error occurred during migration' }, 500);
  }
});

export default admin; 