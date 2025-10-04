import type { Move, GameResult } from './chess.types';

export type GameMode = 
  | 'classical'
  | 'blitz'
  | 'bullet'
  | 'rapid'
  | 'chess960'
  | 'three-check'
  | 'king-of-the-hill'
  | 'crazyhouse';

export type GameStatus = 'waiting' | 'playing' | 'finished' | 'paused';

export type TimeControl = {
  initial: number; // milliseconds
  increment: number; // milliseconds
  delay?: number; // milliseconds
};

export interface Player {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  title?: string;
  country?: string;
  isOnline: boolean;
  lastSeen?: number;
}

export interface GameSettings {
  mode: GameMode;
  timeControl: TimeControl;
  rated: boolean;
  color: 'white' | 'black' | 'random';
  variant: 'standard' | 'chess960' | 'three-check' | 'king-of-the-hill' | 'crazyhouse';
  allowSpectators: boolean;
  private: boolean;
  password?: string;
}

export interface Game {
  id: string;
  whitePlayer: Player;
  blackPlayer: Player;
  settings: GameSettings;
  status: GameStatus;
  position: string; // FEN
  moves: Move[];
  startTime: number;
  lastMoveTime: number;
  spectators: Player[];
  result?: GameResult;
  chat: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'player' | 'spectator' | 'system';
}

export interface GameSummary {
  id: string;
  whitePlayer: Player;
  blackPlayer: Player;
  result: GameResult;
  moves: Move[];
  duration: number;
  timeControl: TimeControl;
  mode: GameMode;
  endTime: number;
}

export interface LobbyGame {
  id: string;
  whitePlayer: Player;
  blackPlayer?: Player;
  settings: GameSettings;
  spectators: number;
  createdAt: number;
}

export interface TimerState {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  activePlayer: 'white' | 'black';
  lastUpdate: number;
}

export interface SpectatorData {
  gameId: string;
  spectators: Player[];
  playerCount: number;
  isWatching: boolean;
}