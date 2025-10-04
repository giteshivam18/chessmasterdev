import { create } from 'zustand';
import { GameState, Move, GameSettings, AppState } from '../types';

const defaultSettings: GameSettings = {
  timeControl: { minutes: 10, increment: 0 },
  preferredColor: 'random',
  soundEnabled: true,
  soundVolume: 0.7,
  theme: 'light',
  boardTheme: 'classic',
  pieceStyle: 'classic',
};

export const useGameStore = create<AppState>((set, get) => ({
  currentGame: null,
  playerName: '',
  playerColor: null,
  roomId: null,
  isConnected: false,
  settings: defaultSettings,
  gameHistory: [],
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  drawOffer: null,

  // Actions
  setPlayerName: (name: string) => set({ playerName: name }),
  
  setPlayerColor: (color: 'white' | 'black' | null) => set({ playerColor: color }),
  
  setRoomId: (roomId: string | null) => set({ roomId }),
  
  setConnectionStatus: (isConnected: boolean) => set({ isConnected }),
  
  updateGameState: (gameState: GameState) => {
    set({ currentGame: gameState });
    
    // Update derived state
    const { currentGame } = get();
    if (currentGame) {
      set({
        isCheck: currentGame.gameStatus === 'playing' && currentGame.fen.includes('K'),
        isCheckmate: currentGame.reason === 'checkmate',
        isStalemate: currentGame.reason === 'stalemate',
      });
    }
  },
  
  addMove: (move: Move) => {
    set((state) => ({
      gameHistory: [...state.gameHistory, move],
      lastMove: { from: move.from, to: move.to },
    }));
  },
  
  setSelectedSquare: (square: string | null) => set({ selectedSquare: square }),
  
  setLegalMoves: (moves: string[]) => set({ legalMoves: moves }),
  
  clearSelection: () => set({ selectedSquare: null, legalMoves: [] }),
  
  updateSettings: (newSettings: Partial<GameSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  
  setDrawOffer: (drawOffer: { from: string; pending: boolean } | null) => 
    set({ drawOffer }),
  
  resetGame: () => {
    set({
      currentGame: null,
      playerColor: null,
      roomId: null,
      gameHistory: [],
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      drawOffer: null,
    });
  },
}));