import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { Move, LegalMove, Square, PieceType, GameResult } from '../types/chess.types';

export interface UseChessGameReturn {
  position: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  moves: Move[];
  legalMoves: LegalMove[];
  makeMove: (from: Square, to: Square, promotion?: PieceType) => boolean;
  getLegalMoves: (square: Square) => LegalMove[];
  reset: () => void;
  undo: () => boolean;
  load: (fen: string) => void;
  getCapturedPieces: () => { white: PieceType[]; black: PieceType[] };
  isGameOver: boolean;
  gameResult: GameResult | null;
}

export const useChessGame = (initialFen?: string): UseChessGameReturn => {
  const [game] = useState(() => new Chess(initialFen));
  const [moves, setMoves] = useState<Move[]>([]);

  const position = game.fen();
  const turn = game.turn();
  const isCheck = game.isCheck();
  const isCheckmate = game.isCheckmate();
  const isStalemate = game.isStalemate();
  const isDraw = game.isDraw();
  const isGameOver = isCheckmate || isStalemate || isDraw;

  const legalMoves = useMemo(() => {
    return game.moves({ verbose: true }) as LegalMove[];
  }, [position]);

  const getLegalMoves = useCallback((square: Square): LegalMove[] => {
    return game.moves({ square: square as any, verbose: true }) as LegalMove[];
  }, [game]);

  const makeMove = useCallback((from: Square, to: Square, promotion?: PieceType): boolean => {
    try {
      const move = game.move({
        from: from as any,
        to: to as any,
        promotion: promotion || 'q', // Default to queen promotion
      });

      if (move) {
        const newMove: Move = {
          from: move.from,
          to: move.to,
          piece: move.piece as PieceType,
          color: move.color,
          captured: move.captured as PieceType | undefined,
          promotion: move.promotion as PieceType | undefined,
          san: move.san,
          lan: move.lan,
          flags: move.flags,
          before: move.before,
          after: move.after,
          timestamp: Date.now(),
        };

        setMoves(prev => [...prev, newMove]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }, [game]);

  const reset = useCallback(() => {
    game.reset();
    setMoves([]);
  }, [game]);

  const undo = useCallback((): boolean => {
    try {
      const move = game.undo();
      if (move) {
        setMoves(prev => prev.slice(0, -1));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Cannot undo:', error);
      return false;
    }
  }, [game]);

  const load = useCallback((fen: string) => {
    try {
      game.load(fen);
      setMoves([]);
    } catch (error) {
      console.error('Invalid FEN:', error);
    }
  }, [game]);

  const getCapturedPieces = useCallback(() => {
    const captured: { white: PieceType[]; black: PieceType[] } = {
      white: [],
      black: [],
    };

    moves.forEach(move => {
      if (move.captured) {
        const piece = move.captured.toLowerCase() as PieceType;
        if (move.color === 'w') {
          captured.black.push(piece);
        } else {
          captured.white.push(piece);
        }
      }
    });

    return captured;
  }, [moves]);

  const gameResult = useMemo((): GameResult | null => {
    if (isCheckmate) {
      return {
        result: turn === 'w' ? 'loss' : 'win',
        reason: 'checkmate',
        winner: turn === 'w' ? 'b' : 'w',
      };
    }
    if (isStalemate) {
      return {
        result: 'draw',
        reason: 'stalemate',
      };
    }
    if (isDraw) {
      return {
        result: 'draw',
        reason: 'agreement',
      };
    }
    return null;
  }, [isCheckmate, isStalemate, isDraw, turn]);

  return {
    position,
    turn,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    moves,
    legalMoves,
    makeMove,
    getLegalMoves,
    reset,
    undo,
    load,
    getCapturedPieces,
    isGameOver,
    gameResult,
  };
};