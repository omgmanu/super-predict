import { Hono } from 'hono';
import { AuthService } from '../services/AuthService';
import { User, UserDB } from '../db/UserDB';
import { createMiddleware } from 'hono/factory';
import { xAuth, XUser } from '@hono/oauth-providers/x';
import { env } from '../utils/env';
import { sessions } from '../utils/session';
import { requireAuth } from '../utils/auth';

// Extend Hono's ContextVariableMap to include our user types
declare module 'hono' {
  interface ContextVariableMap {
    user: User;
  }
}

const auth = new Hono();

// User authentication check middleware
const authMiddleware = createMiddleware(async (c, next) => {
  const user = await requireAuth(c);

  if (!user) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  // Add user to context
  c.set('user', user);

  await next();
});

// X (Twitter) login
auth.use(
  '/x/*',
  xAuth({
    client_id: env.TWITTER_CLIENT_ID,
    client_secret: env.TWITTER_CLIENT_SECRET,
    redirect_uri: env.TWITTER_REDIRECT_URI,
    scope: ['users.read', 'tweet.read'],
    fields: ['profile_image_url', 'username'],
  })
);

// X (Twitter) callback
auth.get('/x/callback', async (c) => {
  const xUser = c.get('user-x');
  console.log('xUser', xUser);

  if (!xUser) {
    return c.json({ success: false, error: 'Authentication failed' }, 401);
  }

  try {
    // Create or get user from X data
    const user = await AuthService.createOrGetUserFromX(xUser as XUser);

    // Set authenticated user in session
    await sessions.setAuthenticatedUser(c, user.id);

    // Redirect to client app after successful login
    return c.redirect(`${env.CLIENT_URL}/play`);
  } catch (error) {
    console.error('Authentication error:', error);
    return c.json({ success: false, error: 'Authentication failed' }, 500);
  }
});

// Get current authenticated user
auth.get('/me', authMiddleware, (c) => {
  const user = c.get('user');
  return c.json({ success: true, data: user });
});

// Logout
auth.post('/logout', async (c) => {
  await sessions.clearSession(c);
  return c.json({ success: true });
});

export default auth;
