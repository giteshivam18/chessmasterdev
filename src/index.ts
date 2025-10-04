import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { GameManager } from './game/gameManager.js';
import { MatchmakingService } from './game/matchmaking.js';
import { InMemoryStorage } from './utils/storage.js';
import { EloCalculator } from './utils/elo.js';

import { createAuthRouter } from './api/auth.js';
import { createGamesRouter } from './api/games.js';
import { createLeaderboardRouter } from './api/leaderboard.js';

import { setupSocketHandlers } from './socket/handlers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

const gameManager = new GameManager();
const matchmaking = new MatchmakingService();
const storage = new InMemoryStorage();
const eloCalculator = new EloCalculator();

app.use(cors());
app.use(express.json());

app.use('/api/auth', createAuthRouter(storage));
app.use('/api/games', createGamesRouter(gameManager, storage));
app.use('/api/leaderboard', createLeaderboardRouter(storage));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Chess Multiplayer Backend',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      games: {
        create: 'POST /api/games/create',
        join: 'POST /api/games/join/:gameId',
        active: 'GET /api/games/active',
        history: 'GET /api/games/history?userId=:userId',
        get: 'GET /api/games/:gameId'
      },
      leaderboard: {
        get: 'GET /api/leaderboard'
      }
    },
    websocket: {
      events: [
        'game:join',
        'game:move',
        'game:resign',
        'game:draw-offer',
        'game:draw-accept',
        'game:start',
        'game:end',
        'timer:update',
        'matchmaking:join',
        'matchmaking:leave',
        'spectator:join',
        'spectator:leave'
      ]
    }
  });
});

setupSocketHandlers(io, gameManager, matchmaking, storage, eloCalculator);

httpServer.listen(PORT, () => {
  console.log(`Chess backend server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
