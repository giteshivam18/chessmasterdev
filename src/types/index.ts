export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Piece = `${PieceColor}${PieceType}`;
export type Square = string;

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  capturedPiece?: Piece;
  promotion?: PieceType;
  isCastling: boolean;
  isEnPassant: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
}

export type GameMode =
  | 'classical'
  | 'blitz'
  | 'rapid'
  | 'bullet'
  | 'chess960'
  | 'three-check'
  | 'king-of-the-hill'
  | 'crazyhouse';

export type TimerFormat = 'fischer' | 'bronstein' | 'simple';

export interface TimeControl {
  initial: number;
  increment?: number;
  format: TimerFormat;
}

export type GameStatus = 'waiting' | 'active' | 'completed';

export type GameResult =
  | 'checkmate'
  | 'timeout'
  | 'resignation'
  | 'draw-agreement'
  | 'stalemate'
  | 'insufficient-material'
  | 'threefold-repetition'
  | 'fifty-move-rule'
  | 'three-check'
  | 'king-of-the-hill';

export interface Player {
  id: string;
  username: string;
  rating: number;
  color: PieceColor;
}

export interface Game {
  id: string;
  whitePlayer: Player;
  blackPlayer: Player;
  mode: GameMode;
  timeControl: TimeControl;
  fen: string;
  status: GameStatus;
  winnerId?: string;
  result?: GameResult;
  whiteTime: number;
  blackTime: number;
  lastMoveTime?: number;
  moves: Move[];
  moveCount: number;
  createdAt: number;
  completedAt?: number;
  threeCheckCount?: { white: number; black: number };
  capturedPieces?: { white: Piece[]; black: Piece[] };
  positionHistory: string[];
  halfMoveClock: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  rating: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  createdAt: number;
}

export interface GameInvite {
  id: string;
  fromUserId: string;
  toUserId: string;
  mode: GameMode;
  timeControl: TimeControl;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: number;
  expiresAt: number;
}
