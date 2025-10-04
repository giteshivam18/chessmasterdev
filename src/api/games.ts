import { Router, Request, Response } from 'express';
import { GameManager } from '../game/gameManager.js';
import { InMemoryStorage } from '../utils/storage.js';
import { GameMode, TimeControl } from '../types/index.js';
import crypto from 'crypto';

export function createGamesRouter(
  gameManager: GameManager,
  storage: InMemoryStorage
): Router {
  const router = Router();

  router.post('/create', async (req: Request, res: Response) => {
    try {
      const { whitePlayerId, blackPlayerId, mode, timeControl } = req.body;

      if (!whitePlayerId || !blackPlayerId || !mode || !timeControl) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const whiteUser = storage.getUserById(whitePlayerId);
      const blackUser = storage.getUserById(blackPlayerId);

      if (!whiteUser || !blackUser) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      const game = gameManager.createGame(
        {
          id: whiteUser.id,
          username: whiteUser.username,
          rating: whiteUser.rating,
          color: 'w'
        },
        {
          id: blackUser.id,
          username: blackUser.username,
          rating: blackUser.rating,
          color: 'b'
        },
        mode as GameMode,
        timeControl as TimeControl
      );

      storage.saveGame(game);
      res.status(201).json({ game });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/join/:gameId', async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;

      if (!playerId || !gameId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const game = gameManager.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      if (game.status !== 'waiting') {
        res.status(400).json({ error: 'Game already started' });
        return;
      }

      const started = gameManager.startGame(gameId);
      if (!started) {
        res.status(400).json({ error: 'Failed to start game' });
        return;
      }

      storage.saveGame(game);
      res.json({ game });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/active', async (req: Request, res: Response) => {
    try {
      const games = storage.getActiveGames();
      res.json({ games });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/history', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string | undefined;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'Missing userId' });
        return;
      }

      const games = storage.getGamesByUser(userId);
      res.json({ games });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/:gameId', async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      if (!gameId) {
        res.status(400).json({ error: 'Missing gameId' });
        return;
      }
      const game = storage.getGame(gameId);

      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      res.json({ game });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
