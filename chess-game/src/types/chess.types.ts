export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Square = string; // e.g., 'e4', 'a1', etc.
export type FEN = string;

export interface Piece {
  type: PieceType;
  color: PieceColor;
  square: Square;
}

export interface Move {
  from: Square;
  to: Square;
  piece: PieceType;
  color: PieceColor;
  captured?: PieceType;
  promotion?: PieceType;
  san: string; // Standard Algebraic Notation
  lan: string; // Long Algebraic Notation
  flags: string;
  before: FEN;
  after: FEN;
  timestamp: number;
}

export interface GamePosition {
  fen: FEN;
  turn: PieceColor;
  castling: string;
  enPassant: Square | null;
  halfmove: number;
  fullmove: number;
}

export interface LegalMove {
  from: Square;
  to: Square;
  piece: PieceType;
  color: PieceColor;
  san: string;
  flags: string;
}

export interface BoardTheme {
  name: string;
  lightSquare: string;
  darkSquare: string;
  pieceSet: 'classic' | 'modern' | 'neo';
}

export interface ChessGameState {
  position: FEN;
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  moves: Move[];
  legalMoves: LegalMove[];
  capturedPieces: {
    white: PieceType[];
    black: PieceType[];
  };
  lastMove: Move | null;
  selectedSquare: Square | null;
  inCheck: boolean;
  gameResult: GameResult | null;
}

export interface GameResult {
  result: 'win' | 'loss' | 'draw';
  reason: 'checkmate' | 'timeout' | 'resignation' | 'stalemate' | 'agreement' | 'repetition' | '50move';
  winner?: PieceColor;
  eloChange?: number;
}

export interface PromotionChoice {
  square: Square;
  piece: PieceType;
  color: PieceColor;
}