import { Router, Request, Response } from 'express';
import { InMemoryStorage } from '../utils/storage.js';
import { User } from '../types/index.js';
import crypto from 'crypto';

export function createAuthRouter(storage: InMemoryStorage): Router {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (storage.getUserByEmail(email)) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      if (storage.getUserByUsername(username)) {
        res.status(400).json({ error: 'Username already taken' });
        return;
      }

      const passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      const user: User = {
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash,
        rating: 1200,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDrawn: 0,
        createdAt: Date.now()
      };

      storage.createUser(user);

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const user = storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      if (user.passwordHash !== passwordHash) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
