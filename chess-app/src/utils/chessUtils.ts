import { Chess } from 'chess.js';
import { Square, Color } from '../types';

export class ChessGame {
  private chess: Chess;

  constructor(fen?: string) {
    this.chess = new Chess(fen);
  }

  getBoard() {
    return this.chess.board();
  }

  getFen() {
    return this.chess.fen();
  }

  getTurn() {
    return this.chess.turn() as Color;
  }

  isGameOver() {
    return this.chess.isGameOver();
  }

  isCheck() {
    return this.chess.isCheck();
  }

  isCheckmate() {
    return this.chess.isCheckmate();
  }

  isStalemate() {
    return this.chess.isStalemate();
  }

  isDraw() {
    return this.chess.isDraw();
  }

  getMoves(square?: Square) {
    return this.chess.moves({ square: square as any, verbose: true });
  }

  getLegalMoves(square?: Square) {
    const moves = this.getMoves(square);
    return moves.map(move => move.to);
  }

  makeMove(move: { from: Square; to: Square; promotion?: string }) {
    try {
      const result = this.chess.move(move);
      return result ? {
        success: true,
        move: result,
        fen: this.chess.fen(),
        turn: this.chess.turn() as Color,
        isCheck: this.chess.isCheck(),
        isCheckmate: this.chess.isCheckmate(),
        isStalemate: this.chess.isStalemate(),
        isGameOver: this.chess.isGameOver(),
      } : {
        success: false,
        error: 'Invalid move',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  undoMove() {
    const move = this.chess.undo();
    return move ? {
      success: true,
      move,
      fen: this.chess.fen(),
      turn: this.chess.turn() as Color,
    } : {
      success: false,
      error: 'No moves to undo',
    };
  }

  getHistory() {
    return this.chess.history({ verbose: true });
  }

  getCapturedPieces() {
    const history = this.getHistory();
    const captured: { white: string[]; black: string[] } = {
      white: [],
      black: [],
    };

    history.forEach(move => {
      if (move.captured) {
        const piece = move.captured;
        if (move.color === 'w') {
          captured.white.push(piece);
        } else {
          captured.black.push(piece);
        }
      }
    });

    return captured;
  }

  reset() {
    this.chess.reset();
    return this.chess.fen();
  }

  load(fen: string) {
    try {
      this.chess.load(fen);
      return true;
    } catch {
      return false;
    }
  }
}

export const getSquareColor = (square: Square): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // a = 0, b = 1, etc.
  const rank = parseInt(square[1]) - 1; // 1 = 0, 2 = 1, etc.
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
};

export const getPieceSymbol = (piece: string): string => {
  const symbols: { [key: string]: string } = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
  };
  return symbols[piece] || piece;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getSquareFromPosition = (x: number, y: number, boardSize: number): Square | null => {
  const squareSize = boardSize / 8;
  const file = Math.floor(x / squareSize);
  const rank = 7 - Math.floor(y / squareSize); // Flip rank (0-7 to 8-1)

  if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
    return String.fromCharCode(97 + file) + (rank + 1) as Square;
  }
  return null;
};

export const getPositionFromSquare = (square: Square, boardSize: number): { x: number; y: number } => {
  const squareSize = boardSize / 8;
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  
  return {
    x: file * squareSize + squareSize / 2,
    y: (7 - rank) * squareSize + squareSize / 2,
  };
};
