import { Context } from 'hono';
import { UserDB, User } from '../db/UserDB';
import { sessions } from './session';

/**
 * Get the current user from the request
 */
export const getCurrentUser = async (c: Context): Promise<User | null> => {
  if (!sessions.isAuthenticated(c)) {
    return null;
  }
  
  const userId = sessions.getUserId(c);
  if (!userId) {
    return null;
  }
  
  return await UserDB.getUser(userId);
};

/**
 * Ensure the user is authenticated
 * Returns user if authenticated or null if not
 */
export const requireAuth = async (c: Context): Promise<User | null> => {
  const user = await getCurrentUser(c);
  
  if (!user) {
    c.status(401);
    return null;
  }
  
  return user;
}; 