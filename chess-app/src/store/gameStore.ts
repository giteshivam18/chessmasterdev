import { create } from 'zustand';
import { GameState, GameRoom } from '../types';

interface GameStore {
  // Game state
  currentRoom: GameRoom | null;
  gameState: GameState | null;
  selectedSquare: string | null;
  legalMoves: string[];
  draggedPiece: string | null;
  
  // Actions
  setCurrentRoom: (room: GameRoom | null) => void;
  updateGameState: (gameState: GameState) => void;
  setSelectedSquare: (square: string | null) => void;
  setLegalMoves: (moves: string[]) => void;
  setDraggedPiece: (piece: string | null) => void;
  makeMove: (from: string, to: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentRoom: null,
  gameState: null,
  selectedSquare: null,
  legalMoves: [],
  draggedPiece: null,

  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  updateGameState: (gameState) => set({ gameState }),
  
  setSelectedSquare: (square) => set({ selectedSquare: square }),
  
  setLegalMoves: (moves) => set({ legalMoves: moves }),
  
  setDraggedPiece: (piece) => set({ draggedPiece: piece }),
  
  makeMove: (from, to) => {
    // This will be implemented with chess.js and socket.io
    console.log('Making move from', from, 'to', to);
  },
  
  resetGame: () => set({
    currentRoom: null,
    gameState: null,
    selectedSquare: null,
    legalMoves: [],
    draggedPiece: null,
  }),
}));
