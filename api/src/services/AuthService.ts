import { Redis } from 'ioredis';
import { AppService } from './AppService';
import { User, UserDB } from '../db/UserDB';
import { XUser } from '@hono/oauth-providers/x';

export class AuthService {
  private static getRedisClient(): Redis {
    return AppService.getInstance().getRedisClient();
  }

  /**
   * Create or get user from X (Twitter) OAuth data
   */
  public static async createOrGetUserFromX(xUser: XUser): Promise<User> {
    const existingUser = await UserDB.getUser(xUser.id);
    
    if (existingUser) {
      // Update user data if needed
      existingUser.username = xUser.username;
      existingUser.profileImageUrl = xUser.profile_image_url;
      await UserDB.saveUser(existingUser);
      return existingUser;
    }
    
    // Create new user using X's user ID directly
    const newUser: User = {
      id: xUser.id, // Using X's ID as the user ID
      username: xUser.username,
      profileImageUrl: xUser.profile_image_url,
      points: 0,
      coins: 100 // Start with 100 coins
    };
    
    await UserDB.saveUser(newUser);
    return newUser;
  }
} 