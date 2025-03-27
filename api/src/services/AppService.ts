import { Redis } from 'ioredis';
import { env } from '../utils/env';

/**
 * AppService is a singleton that provides access to key app features
 * including the Redis client connection
 */
export class AppService {
  private static instance: AppService;
  private redisClient: Redis | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of AppService
   */
  public static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  /**
   * Initialize the app service
   */
  public async init(): Promise<void> {
    // Initialize Redis connection
    await this.connectToRedis();
  }

  /**
   * Connect to Redis using environment variables
   */
  private async connectToRedis(): Promise<void> {
    try {
      this.redisClient = new Redis(env.REDIS_URL);
      console.log('Successfully connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Get the Redis client
   */
  public getRedisClient(): Redis {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized. Call init() first.');
    }
    return this.redisClient;
  }

  /**
   * Cleanup resources when shutting down
   */
  public async cleanup(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.redisClient = null;
    }
  }
} 