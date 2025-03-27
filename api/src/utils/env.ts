import { z } from 'zod';

/**
 * Schema for environment variables
 */
const envSchema = z.object({
  // API Configuration
  HOST: z.string().optional(),
  PORT: z.string().transform((val) => parseInt(val, 10)).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  
  // Client Configuration
  CLIENT_URL: z.string().optional(),
  
  // Redis Configuration
  REDIS_URL: z.string().optional(),
  
  // Twitter/X OAuth Configuration
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),
  TWITTER_REDIRECT_URI: z.string().optional(),
  
  // Session Configuration
  SESSION_ENCRYPTION_KEY: z.string().optional(),
  
  // Cron Authentication Key
  CRON_AUTH_KEY: z.string().optional(),
});

/**
 * Parse and validate environment variables
 */
function validateEnv() {
  // Load environment variables
  const env = process.env;

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        return `${err.path.join('.')}: ${err.message}`;
      });
      
      console.error("❌ Invalid environment variables:");
      console.error(errorMessages.join('\n'));
      console.error("\nCheck your .env file and make sure all required variables are set with correct values.");
    } else {
      console.error("❌ Unknown error validating environment variables:", error);
    }
    
    process.exit(1);
  }
}

/**
 * Validated environment variables
 */
export const env = validateEnv();

/**
 * Type definition for environment variables
 */
export type Env = z.infer<typeof envSchema>;