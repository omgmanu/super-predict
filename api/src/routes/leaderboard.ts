import { Hono } from 'hono';
import { UserDB } from '../db/UserDB';

const leaderboard = new Hono();

/**
 * GET /leaderboard - Get top users by points for the leaderboard
 */
leaderboard.get('/', async (c) => {
  try {
    // Get the limit parameter or default to 100
    const limitParam = c.req.query('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;
    
    if (isNaN(limit) || limit <= 0) {
      return c.json({ 
        success: false, 
        error: 'Limit must be a positive number' 
      }, 400);
    }
    
    // Get leaderboard data
    const users = await UserDB.getLeaderboard(limit);
    
    // Transform data for the leaderboard
    const leaderboardData = users.map((user, index) => {
      const winRate = user.gamesPlayed > 0 
        ? (user.gamesWon / user.gamesPlayed * 100).toFixed(1) + '%'
        : '0%';
        
      return {
        rank: index + 1,
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        points: user.points,
        gamesPlayed: user.gamesPlayed || 0,
        winRate,
        boosts: user.boosts || []
      };
    });
    
    return c.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ success: false, error: 'Failed to fetch leaderboard' }, 500);
  }
});

export default leaderboard; 