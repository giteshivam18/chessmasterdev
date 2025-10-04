import { Piece, PieceColor, Square, Position } from '../types/index.js';

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class ChessBoard {
  private board: (Piece | null)[][];
  private turn: PieceColor;
  private castlingRights: { K: boolean; Q: boolean; k: boolean; q: boolean };
  private enPassantSquare: Square | null;
  private halfMoveClock: number;
  private fullMoveNumber: number;

  constructor(fen: string = INITIAL_FEN) {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.turn = 'w';
    this.castlingRights = { K: true, Q: true, k: true, q: true };
    this.enPassantSquare = null;
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
    this.loadFEN(fen);
  }

  loadFEN(fen: string): void {
    const parts = fen.split(' ');
    const position = parts[0];
    const rows = position?.split('/');

    if (!rows || rows.length !== 8) return;

    for (let i = 0; i < 8; i++) {
      const row = rows[i];
      if (!row) continue;
      let col = 0;
      for (const char of row) {
        if (char >= '1' && char <= '8') {
          col += parseInt(char);
        } else {
          const color = char === char.toLowerCase() ? 'b' : 'w';
          const piece = char.toLowerCase() as PieceType;
          if (this.board[i]) {
            this.board[i]![col] = `${color}${piece}` as Piece;
          }
          col++;
        }
      }
    }

    this.turn = parts[1] === 'b' ? 'b' : 'w';

    const castling = parts[2] || '-';
    this.castlingRights = {
      K: castling.includes('K'),
      Q: castling.includes('Q'),
      k: castling.includes('k'),
      q: castling.includes('q'),
    };

    this.enPassantSquare = parts[3] !== '-' && parts[3] ? parts[3] : null;
    this.halfMoveClock = parseInt(parts[4] || '0');
    this.fullMoveNumber = parseInt(parts[5] || '1');
  }

  toFEN(): string {
    let fen = '';

    for (let row = 0; row < 8; row++) {
      let empty = 0;
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row]?.[col];
        if (piece) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          const [color, type] = [piece[0], piece[1]];
          fen += color === 'w' ? type!.toUpperCase() : type;
        } else {
          empty++;
        }
      }
      if (empty > 0) fen += empty;
      if (row < 7) fen += '/';
    }

    fen += ` ${this.turn}`;

    let castling = '';
    if (this.castlingRights.K) castling += 'K';
    if (this.castlingRights.Q) castling += 'Q';
    if (this.castlingRights.k) castling += 'k';
    if (this.castlingRights.q) castling += 'q';
    fen += ` ${castling || '-'}`;

    fen += ` ${this.enPassantSquare || '-'}`;
    fen += ` ${this.halfMoveClock}`;
    fen += ` ${this.fullMoveNumber}`;

    return fen;
  }

  getPiece(square: Square): Piece | null {
    const pos = this.squareToPosition(square);
    return this.board[pos.row]?.[pos.col] ?? null;
  }

  setPiece(square: Square, piece: Piece | null): void {
    const pos = this.squareToPosition(square);
    if (this.board[pos.row]) {
      this.board[pos.row]![pos.col] = piece;
    }
  }

  squareToPosition(square: Square): Position {
    const col = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square[1] || '1');
    return { row, col };
  }

  positionToSquare(pos: Position): Square {
    return String.fromCharCode(97 + pos.col) + (8 - pos.row);
  }

  getTurn(): PieceColor {
    return this.turn;
  }

  setTurn(color: PieceColor): void {
    this.turn = color;
  }

  getCastlingRights() {
    return { ...this.castlingRights };
  }

  setCastlingRight(right: keyof typeof this.castlingRights, value: boolean): void {
    this.castlingRights[right] = value;
  }

  getEnPassantSquare(): Square | null {
    return this.enPassantSquare;
  }

  setEnPassantSquare(square: Square | null): void {
    this.enPassantSquare = square;
  }

  getHalfMoveClock(): number {
    return this.halfMoveClock;
  }

  incrementHalfMoveClock(): void {
    this.halfMoveClock++;
  }

  resetHalfMoveClock(): void {
    this.halfMoveClock = 0;
  }

  incrementFullMoveNumber(): void {
    this.fullMoveNumber++;
  }

  clone(): ChessBoard {
    return new ChessBoard(this.toFEN());
  }
}

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
