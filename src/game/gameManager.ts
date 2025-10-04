import { ChessEngine } from '../chess/engine.js';
import { Game, Player, GameMode, TimeControl, GameStatus, GameResult, Move, PieceColor } from '../types/index.js';
import { INITIAL_FEN } from '../chess/board.js';

export class GameManager {
  private games: Map<string, Game>;
  private engines: Map<string, ChessEngine>;
  private timers: Map<string, NodeJS.Timeout>;

  constructor() {
    this.games = new Map();
    this.engines = new Map();
    this.timers = new Map();
  }

  createGame(whitePlayer: Player, blackPlayer: Player, mode: GameMode, timeControl: TimeControl): Game {
    const gameId = this.generateGameId();
    const fen = mode === 'chess960' ? this.generateChess960Position() : INITIAL_FEN;

    const game: Game = {
      id: gameId,
      whitePlayer,
      blackPlayer,
      mode,
      timeControl,
      fen,
      status: 'waiting',
      whiteTime: timeControl.initial,
      blackTime: timeControl.initial,
      moves: [],
      moveCount: 0,
      createdAt: Date.now(),
      positionHistory: [fen],
      halfMoveClock: 0
    };

    if (mode === 'three-check') {
      game.threeCheckCount = { white: 0, black: 0 };
    }

    if (mode === 'crazyhouse') {
      game.capturedPieces = { white: [], black: [] };
    }

    this.games.set(gameId, game);
    this.engines.set(gameId, new ChessEngine(fen));

    return game;
  }

  startGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'waiting') return false;

    game.status = 'active';
    game.lastMoveTime = Date.now();
    this.startTimer(gameId);

    return true;
  }

  makeMove(gameId: string, playerId: string, from: string, to: string, promotion?: string): Move | null {
    const game = this.games.get(gameId);
    const engine = this.engines.get(gameId);

    if (!game || !engine || game.status !== 'active') return null;

    const currentPlayer = engine.getTurn() === 'w' ? game.whitePlayer : game.blackPlayer;
    if (currentPlayer.id !== playerId) return null;

    const move = engine.makeMove(from, to, promotion);
    if (!move) return null;

    const now = Date.now();
    const timeTaken = now - (game.lastMoveTime || now);

    this.updateTime(game, engine.getTurn() === 'w' ? 'b' : 'w', timeTaken);

    game.moves.push(move);
    game.moveCount++;
    game.fen = engine.getFEN();
    game.positionHistory = engine.getPositionHistory();
    game.halfMoveClock = engine.getHalfMoveClock();
    game.lastMoveTime = now;

    if (game.mode === 'three-check' && move.isCheck && game.threeCheckCount) {
      const checkedColor = engine.getTurn();
      game.threeCheckCount[checkedColor === 'w' ? 'white' : 'black']++;

      if (game.threeCheckCount[checkedColor === 'w' ? 'white' : 'black'] >= 3) {
        this.endGame(gameId, currentPlayer.id, 'three-check');
      }
    }

    if (game.mode === 'king-of-the-hill') {
      const kingSquares = ['d4', 'd5', 'e4', 'e5'];
      const movedPiece = move.piece[1];
      if (movedPiece === 'k' && kingSquares.includes(move.to)) {
        this.endGame(gameId, currentPlayer.id, 'king-of-the-hill');
      }
    }

    const gameResult = engine.getGameResult();
    if (gameResult) {
      const winnerId = move.isCheckmate ? currentPlayer.id : undefined;
      this.endGame(gameId, winnerId, gameResult);
    }

    return move;
  }

  private updateTime(game: Game, playerColor: PieceColor, timeTaken: number): void {
    if (playerColor === 'w') {
      game.whiteTime = Math.max(0, game.whiteTime - timeTaken);
      if (game.timeControl.increment) {
        if (game.timeControl.format === 'fischer') {
          game.whiteTime += game.timeControl.increment;
        } else if (game.timeControl.format === 'bronstein') {
          game.whiteTime += Math.min(timeTaken, game.timeControl.increment);
        }
      }
    } else {
      game.blackTime = Math.max(0, game.blackTime - timeTaken);
      if (game.timeControl.increment) {
        if (game.timeControl.format === 'fischer') {
          game.blackTime += game.timeControl.increment;
        } else if (game.timeControl.format === 'bronstein') {
          game.blackTime += Math.min(timeTaken, game.timeControl.increment);
        }
      }
    }
  }

  private startTimer(gameId: string): void {
    const timer = setInterval(() => {
      this.checkTimeouts(gameId);
    }, 100);

    this.timers.set(gameId, timer);
  }

  private checkTimeouts(gameId: string): void {
    const game = this.games.get(gameId);
    const engine = this.engines.get(gameId);

    if (!game || !engine || game.status !== 'active') return;

    const now = Date.now();
    const elapsed = now - (game.lastMoveTime || now);
    const currentColor = engine.getTurn();

    if (currentColor === 'w') {
      game.whiteTime = Math.max(0, game.whiteTime - elapsed);
      if (game.whiteTime === 0) {
        this.endGame(gameId, game.blackPlayer.id, 'timeout');
      }
    } else {
      game.blackTime = Math.max(0, game.blackTime - elapsed);
      if (game.blackTime === 0) {
        this.endGame(gameId, game.whitePlayer.id, 'timeout');
      }
    }

    game.lastMoveTime = now;
  }

  endGame(gameId: string, winnerId?: string, result?: GameResult): void {
    const game = this.games.get(gameId);
    if (!game) return;

    game.status = 'completed';
    game.winnerId = winnerId;
    game.result = result;
    game.completedAt = Date.now();

    const timer = this.timers.get(gameId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(gameId);
    }
  }

  resignGame(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'active') return false;

    const winnerId = playerId === game.whitePlayer.id ? game.blackPlayer.id : game.whitePlayer.id;
    this.endGame(gameId, winnerId, 'resignation');

    return true;
  }

  offerDraw(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'active') return false;

    return playerId === game.whitePlayer.id || playerId === game.blackPlayer.id;
  }

  acceptDraw(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'active') return false;

    this.endGame(gameId, undefined, 'draw-agreement');
    return true;
  }

  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  getActiveGames(): Game[] {
    return Array.from(this.games.values()).filter(game => game.status === 'active');
  }

  getUserGames(userId: string): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.whitePlayer.id === userId || game.blackPlayer.id === userId
    );
  }

  private generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateChess960Position(): string {
    const pieces = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j]!, pieces[i]!];
    }

    const backRank = pieces.join('');
    return `${backRank}/pppppppp/8/8/8/8/PPPPPPPP/${backRank.toUpperCase()} w KQkq - 0 1`;
  }
}
