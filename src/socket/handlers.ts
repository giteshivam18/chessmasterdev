import { Server, Socket } from 'socket.io';
import { GameManager } from '../game/gameManager.js';
import { MatchmakingService } from '../game/matchmaking.js';
import { InMemoryStorage } from '../utils/storage.js';
import { EloCalculator } from '../utils/elo.js';
import { GameMode, TimeControl } from '../types/index.js';

export function setupSocketHandlers(
  io: Server,
  gameManager: GameManager,
  matchmaking: MatchmakingService,
  storage: InMemoryStorage,
  eloCalculator: EloCalculator
): void {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('game:join', (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      const game = gameManager.getGame(gameId);

      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      socket.join(gameId);
      socket.emit('game:joined', { game });

      if (game.status === 'waiting') {
        const started = gameManager.startGame(gameId);
        if (started) {
          storage.saveGame(game);
          io.to(gameId).emit('game:start', { game });
        }
      }
    });

    socket.on('game:move', (data: { gameId: string; userId: string; from: string; to: string; promotion?: string }) => {
      const { gameId, userId, from, to, promotion } = data;
      const game = gameManager.getGame(gameId);

      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const move = gameManager.makeMove(gameId, userId, from, to, promotion);

      if (!move) {
        socket.emit('error', { message: 'Invalid move' });
        return;
      }

      storage.saveGame(game);
      io.to(gameId).emit('game:move', { move, game });
      io.to(gameId).emit('timer:update', {
        whiteTime: game.whiteTime,
        blackTime: game.blackTime
      });

      if (game.status === 'completed') {
        handleGameEnd(game);
      }
    });

    socket.on('game:resign', (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      const resigned = gameManager.resignGame(gameId, userId);

      if (!resigned) {
        socket.emit('error', { message: 'Cannot resign' });
        return;
      }

      const game = gameManager.getGame(gameId);
      if (game) {
        storage.saveGame(game);
        io.to(gameId).emit('game:end', { game });
        handleGameEnd(game);
      }
    });

    socket.on('game:draw-offer', (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      const offered = gameManager.offerDraw(gameId, userId);

      if (!offered) {
        socket.emit('error', { message: 'Cannot offer draw' });
        return;
      }

      const game = gameManager.getGame(gameId);
      if (game) {
        const opponentId = userId === game.whitePlayer.id
          ? game.blackPlayer.id
          : game.whitePlayer.id;

        io.to(gameId).emit('game:draw-offer', { fromUserId: userId });
      }
    });

    socket.on('game:draw-accept', (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      const accepted = gameManager.acceptDraw(gameId, userId);

      if (!accepted) {
        socket.emit('error', { message: 'Cannot accept draw' });
        return;
      }

      const game = gameManager.getGame(gameId);
      if (game) {
        storage.saveGame(game);
        io.to(gameId).emit('game:end', { game });
        handleGameEnd(game);
      }
    });

    socket.on('matchmaking:join', (data: { userId: string; mode: GameMode; timeControl: TimeControl }) => {
      const { userId, mode, timeControl } = data;
      const user = storage.getUserById(userId);

      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const player = {
        id: user.id,
        username: user.username,
        rating: user.rating,
        color: 'w' as const
      };

      const opponent = matchmaking.findMatch(player, mode, timeControl);

      if (opponent) {
        const game = gameManager.createGame(
          player,
          { ...opponent.player, color: 'b' },
          mode,
          timeControl
        );

        storage.saveGame(game);
        gameManager.startGame(game.id);

        io.to(socket.id).emit('matchmaking:found', { game });

        const opponentSockets = Array.from(io.sockets.sockets.values())
          .filter(s => s.data.userId === opponent.player.id);

        opponentSockets.forEach(s => {
          s.emit('matchmaking:found', { game });
          s.join(game.id);
        });

        socket.join(game.id);
        io.to(game.id).emit('game:start', { game });
      } else {
        matchmaking.addToQueue(player, mode, timeControl);
        socket.emit('matchmaking:queued', { message: 'Searching for opponent...' });
      }
    });

    socket.on('matchmaking:leave', (data: { userId: string }) => {
      const { userId } = data;
      matchmaking.removeFromQueue(userId);
      socket.emit('matchmaking:left', { message: 'Left matchmaking queue' });
    });

    socket.on('spectator:join', (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      const game = gameManager.getGame(gameId);

      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      socket.join(`spectator:${gameId}`);
      socket.emit('spectator:joined', { game });
    });

    socket.on('spectator:leave', (data: { gameId: string }) => {
      const { gameId } = data;
      socket.leave(`spectator:${gameId}`);
      socket.emit('spectator:left', { message: 'Left spectator mode' });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    function handleGameEnd(game: any): void {
      const whiteUser = storage.getUserById(game.whitePlayer.id);
      const blackUser = storage.getUserById(game.blackPlayer.id);

      if (!whiteUser || !blackUser) return;

      whiteUser.gamesPlayed++;
      blackUser.gamesPlayed++;

      let result: 'player1' | 'player2' | 'draw' = 'draw';

      if (game.winnerId === whiteUser.id) {
        whiteUser.gamesWon++;
        blackUser.gamesLost++;
        result = 'player1';
      } else if (game.winnerId === blackUser.id) {
        blackUser.gamesWon++;
        whiteUser.gamesLost++;
        result = 'player2';
      } else {
        whiteUser.gamesDrawn++;
        blackUser.gamesDrawn++;
      }

      const newRatings = eloCalculator.updateRatings(
        whiteUser.rating,
        blackUser.rating,
        result
      );

      whiteUser.rating = newRatings.player1NewRating;
      blackUser.rating = newRatings.player2NewRating;

      storage.updateUser(whiteUser);
      storage.updateUser(blackUser);

      io.to(game.id).emit('ratings:updated', {
        whitePlayer: { id: whiteUser.id, rating: whiteUser.rating },
        blackPlayer: { id: blackUser.id, rating: blackUser.rating }
      });
    }
  });
}
