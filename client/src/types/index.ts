export interface Player {
  socketId: string;
  name: string;
}

export interface GameState {
  id: string;
  fen: string;
  pgn: string;
  turn: 'w' | 'b';
  gameStatus: 'waiting' | 'playing' | 'finished';
  timers: {
    white: number;
    black: number;
  };
  players: {
    white: Player | null;
    black: Player | null;
  };
  winner: string | null;
  reason: string | null;
  timeControl: {
    minutes: number;
    increment: number;
  };
}

export interface Move {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  lan: string;
  color: 'w' | 'b';
  piece: string;
  captured?: string;
  flags: string;
}

export interface TimeControl {
  minutes: number;
  increment: number;
}

export interface GameSettings {
  timeControl: TimeControl;
  preferredColor: 'white' | 'black' | 'random';
  soundEnabled: boolean;
  soundVolume: number;
  theme: 'light' | 'dark';
  boardTheme: 'classic' | 'modern' | 'wood';
  pieceStyle: 'classic' | 'modern';
}

export interface AppState {
  currentGame: GameState | null;
  playerName: string;
  playerColor: 'white' | 'black' | null;
  roomId: string | null;
  isConnected: boolean;
  settings: GameSettings;
  gameHistory: Move[];
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  drawOffer: { from: string; pending: boolean } | null;
}