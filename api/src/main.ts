import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { AppService } from './services/AppService';
import authRoutes from './routes/auth';
import gamesRoutes from './routes/games';
import coinsRoutes from './routes/coins';
import gameRoutes from './routes/game';
import leaderboardRoutes from './routes/leaderboard';
import boostsRoutes from './routes/boosts';
import automatorRoutes from './routes/automator';
import adminRoutes from './routes/admin';
import { env } from './utils/env';
import { session } from './utils/session';

// Create app instance
const app = new Hono();

// CORS configuration for the client
app.use(
  '/*',
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
  })
);

// Apply session middleware to all routes
app.use('/*', session);

// Root endpoint
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Super Predict API' });
});

// Mount API routes
const api = new Hono();
api.route('/auth', authRoutes);
api.route('/games', gamesRoutes);
api.route('/coins', coinsRoutes);
api.route('/game', gameRoutes);
api.route('/leaderboard', leaderboardRoutes);
api.route('/boosts', boostsRoutes);
api.route('/automator', automatorRoutes);
api.route('/admin', adminRoutes);

app.route('/api', api);

// Initialize the app
const init = async () => {
  try {
    // Initialize AppService (connects to Redis)
    await AppService.getInstance().init();

    // Start the server
    console.log(`Starting server on http://${env.HOST}:${env.PORT}`);
    serve({
      fetch: app.fetch,
      port: env.PORT,
      hostname: env.HOST,
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

// Handle shutdown
const shutdown = async () => {
  try {
    await AppService.getInstance().cleanup();
    console.log('Application shutdown gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the application
init();
