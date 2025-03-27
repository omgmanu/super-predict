import { sessionMiddleware, CookieStore, Session } from 'hono-sessions';
import { Context } from 'hono';
import { env } from './env';

/**
 * Define session data structure types
 */
export type SessionData = {
  userId: string;
  isAuthenticated: boolean;
}

// Extend Hono's ContextVariableMap to include session
declare module 'hono' {
  interface ContextVariableMap {
    session: Session<SessionData>;
  }
}

/**
 * Create and export the session middleware
 */
export const session = sessionMiddleware({
  store: new CookieStore(),
  encryptionKey: env.SESSION_ENCRYPTION_KEY, // Required for CookieStore
  expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days
  cookieOptions: {
    sameSite: 'Lax', // CSRF protection
    path: '/', // Required for the library to work properly
    httpOnly: true, // Avoid XSS attacks
    secure: env.NODE_ENV === 'production',
  },
});

/**
 * Session management utilities
 */
export const sessions = {
  /**
   * Get user ID from session
   */
  getUserId: (c: Context): string | null => {
    const session = c.get('session');
    const userId = session.get('userId');
    return userId || null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (c: Context): boolean => {
    const session = c.get('session');
    return !!session.get('isAuthenticated');
  },

  /**
   * Set authenticated user in session
   */
  setAuthenticatedUser: async (c: Context, userId: string): Promise<void> => {
    const session = c.get('session');
    session.set('userId', userId);
    session.set('isAuthenticated', true);
  },

  /**
   * Clear session
   */
  clearSession: async (c: Context): Promise<void> => {
    const session = c.get('session');
    session.set('userId', '');
    session.set('isAuthenticated', false);
  },
}; 