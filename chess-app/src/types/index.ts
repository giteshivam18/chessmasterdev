export interface GameState {
  board: string;
  turn: 'w' | 'b';
  gameStatus: 'waiting' | 'playing' | 'finished' | 'paused';
  winner: 'w' | 'b' | 'draw' | null;
  lastMove: string | null;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  moveHistory: string[];
  timeLeft: {
    white: number;
    black: number;
  };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
  isOnline: boolean;
}

export interface GameRoom {
  id: string;
  name: string;
  players: {
    white: Player | null;
    black: Player | null;
  };
  spectators: Player[];
  gameState: GameState;
  timeControl: {
    initial: number; // seconds
    increment: number; // seconds per move
  };
  isPrivate: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  gamesPlayed: number;
  gamesWon: number;
  isOnline: boolean;
}

export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  soundVolume: number;
  boardTheme: 'classic' | 'modern' | 'wood' | 'marble';
  pieceStyle: 'classic' | 'modern' | 'fantasy';
  showLegalMoves: boolean;
  showCoordinates: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

export interface Move {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string;
  timestamp: number;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  timeControl: {
    initial: number;
    increment: number;
  };
  icon: string;
  isPopular?: boolean;
}

export type Square = string; // e.g., 'e4', 'a1'
export type Piece = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type Color = 'w' | 'b';

export interface DragData {
  piece: string;
  from: Square;
  to: Square;
}

export interface SoundEffect {
  move: string;
  capture: string;
  castle: string;
  check: string;
  checkmate: string;
  draw: string;
  timer: string;
  button: string;
  error: string;
}
