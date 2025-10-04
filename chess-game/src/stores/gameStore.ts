import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Game, Player } from '../types/game.types';
import type { ChessGameState, Move, GameResult, LegalMove, Square, PieceType } from '../types/chess.types';

interface GameStore extends ChessGameState {
  // Game data
  gameId: string | null;
  gameMode: string;
  timeControl: { initial: number; increment: number };
  playerColor: 'white' | 'black';
  opponentInfo: Player | null;
  gameStatus: 'waiting' | 'playing' | 'finished' | 'paused';
  result: GameResult | null;
  
  // UI state
  selectedSquare: Square | null;
  legalMoves: LegalMove[];
  lastMove: Move | null;
  capturedPieces: { white: PieceType[]; black: PieceType[] };
  moveHistory: Move[];
  
  // Actions
  setGame: (game: Game) => void;
  updatePosition: (fen: string) => void;
  selectSquare: (square: Square | null) => void;
  makeMove: (move: Move) => void;
  endGame: (result: GameResult) => void;
  reset: () => void;
  setLegalMoves: (moves: LegalMove[]) => void;
  setLastMove: (move: Move | null) => void;
  addCapturedPiece: (piece: PieceType, color: 'white' | 'black') => void;
  setGameStatus: (status: 'waiting' | 'playing' | 'finished' | 'paused') => void;
  setOpponentInfo: (opponent: Player | null) => void;
  setPlayerColor: (color: 'white' | 'black') => void;
}

const initialState: ChessGameState = {
  position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  turn: 'w',
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  isDraw: false,
  moves: [],
  legalMoves: [],
  capturedPieces: { white: [], black: [] },
  lastMove: null,
  selectedSquare: null,
  inCheck: false,
  gameResult: null,
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      ...initialState,
      gameId: null,
      gameMode: 'classical',
      timeControl: { initial: 600000, increment: 0 }, // 10 minutes
      playerColor: 'white',
      opponentInfo: null,
      gameStatus: 'waiting',
      result: null,
      moveHistory: [],

      setGame: (game: Game) => set((state) => ({
        gameId: game.id,
        gameMode: game.settings.mode,
        timeControl: game.settings.timeControl,
        playerColor: game.whitePlayer.id === state.playerColor ? 'white' : 'black',
        opponentInfo: game.whitePlayer.id === state.playerColor ? game.blackPlayer : game.whitePlayer,
        gameStatus: game.status,
        position: game.position,
        moves: game.moves,
        moveHistory: game.moves,
        lastMove: game.moves[game.moves.length - 1] || null,
      })),

      updatePosition: (fen: string) => set(() => ({
        position: fen,
        turn: fen.split(' ')[1] as 'w' | 'b',
      })),

      selectSquare: (square: Square | null) => set(() => ({
        selectedSquare: square,
      })),

      makeMove: (move: Move) => set((state) => ({
        moves: [...state.moves, move],
        moveHistory: [...state.moveHistory, move],
        lastMove: move,
        selectedSquare: null,
        legalMoves: [],
        position: move.after,
        turn: move.color === 'w' ? 'b' : 'w',
      })),

      endGame: (result: GameResult) => set(() => ({
        gameStatus: 'finished',
        result,
        gameResult: result,
      })),

      reset: () => set(() => ({
        ...initialState,
        gameId: null,
        gameMode: 'classical',
        timeControl: { initial: 600000, increment: 0 },
        playerColor: 'white',
        opponentInfo: null,
        gameStatus: 'waiting',
        result: null,
        moveHistory: [],
      })),

      setLegalMoves: (moves: LegalMove[]) => set(() => ({
        legalMoves: moves,
      })),

      setLastMove: (move: Move | null) => set(() => ({
        lastMove: move,
      })),

      addCapturedPiece: (piece: PieceType, color: 'white' | 'black') => set((state) => ({
        capturedPieces: {
          ...state.capturedPieces,
          [color]: [...state.capturedPieces[color], piece],
        },
      })),

      setGameStatus: (status: 'waiting' | 'playing' | 'finished') => set(() => ({
        gameStatus: status,
      })),

      setOpponentInfo: (opponent: Player | null) => set(() => ({
        opponentInfo: opponent,
      })),

      setPlayerColor: (color: 'white' | 'black') => set(() => ({
        playerColor: color,
      })),
    }),
    {
      name: 'game-store',
    }
  )
);