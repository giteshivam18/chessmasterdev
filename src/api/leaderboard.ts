import { Router, Request, Response } from 'express';
import { InMemoryStorage } from '../utils/storage.js';

export function createLeaderboardRouter(storage: InMemoryStorage): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const leaderboard = storage.getLeaderboard(limit);

      const formattedLeaderboard = leaderboard.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        rating: user.rating,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        gamesLost: user.gamesLost,
        gamesDrawn: user.gamesDrawn
      }));

      res.json({ leaderboard: formattedLeaderboard });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
