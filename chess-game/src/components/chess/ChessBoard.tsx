import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { useChessGame } from '../../hooks/useChessGame';
import { useSettingsStore } from '../../stores/settingsStore';
import type { Square, PieceType } from '../../types/chess.types';
import { squareToCoords, coordsToSquare, isLightSquare } from '../../utils/chessHelpers';

export interface ChessBoardProps {
  onMove?: (from: Square, to: Square, promotion?: PieceType) => void;
  orientation?: 'white' | 'black';
  lastMove?: { from: Square; to: Square } | null;
  inCheck?: boolean;
  selectedSquare?: Square | null;
  onSquareClick?: (square: Square) => void;
  disabled?: boolean;
  showCoordinates?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  onMove,
  orientation = 'white',
  lastMove,
  inCheck = false,
  selectedSquare,
  onSquareClick,
  disabled = false,
  showCoordinates = true,
}) => {
  const { position, makeMove, getLegalMoves } = useChessGame();
  const { showLegalMoves } = useSettingsStore();
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);

  // Parse FEN to get board state
  const boardState = useMemo(() => {
    const fen = position.split(' ')[0];
    const rows = fen.split('/');
    const board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

    rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      for (const char of row) {
        if (char >= '1' && char <= '8') {
          colIndex += parseInt(char);
        } else {
          board[rowIndex][colIndex] = char;
          colIndex++;
        }
      }
    });

    return board;
  }, [position]);

  // Get piece at square
  const getPieceAt = useCallback((square: Square): string | null => {
    const { x, y } = squareToCoords(square);
    return boardState[y][x];
  }, [boardState]);

  // Handle square click
  const handleSquareClick = useCallback((square: Square) => {
    if (disabled) return;

    const piece = getPieceAt(square);
    const isWhitePiece = piece && piece === piece.toUpperCase();
    const isBlackPiece = piece && piece === piece.toLowerCase();
    const isCurrentPlayerPiece = (orientation === 'white' && isWhitePiece) || 
                                (orientation === 'black' && isBlackPiece);

    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        onSquareClick?.(null as any);
      } else if (isCurrentPlayerPiece) {
        // Select new piece
        onSquareClick?.(square);
      } else {
        // Try to move
        const success = makeMove(selectedSquare, square);
        if (success) {
          onMove?.(selectedSquare, square);
          onSquareClick?.(null as any);
        }
      }
    } else if (isCurrentPlayerPiece) {
      // Select piece
      onSquareClick?.(square);
    }
  }, [disabled, getPieceAt, orientation, selectedSquare, makeMove, onMove, onSquareClick]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, square: Square) => {
    if (disabled) return;
    
    const piece = getPieceAt(square);
    if (!piece) return;

    const isWhitePiece = piece === piece.toUpperCase();
    const isBlackPiece = piece === piece.toLowerCase();
    const isCurrentPlayerPiece = (orientation === 'white' && isWhitePiece) || 
                                (orientation === 'black' && isBlackPiece);

    if (isCurrentPlayerPiece) {
      setDraggedSquare(square);
      e.dataTransfer.effectAllowed = 'move';
    } else {
      e.preventDefault();
    }
  }, [disabled, getPieceAt, orientation]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, square: Square) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSquare(square);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, square: Square) => {
    e.preventDefault();
    
    if (draggedSquare && draggedSquare !== square) {
      const success = makeMove(draggedSquare, square);
      if (success) {
        onMove?.(draggedSquare, square);
      }
    }
    
    setDraggedSquare(null);
    setDragOverSquare(null);
  }, [draggedSquare, makeMove, onMove]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedSquare(null);
    setDragOverSquare(null);
  }, []);

  // Get legal moves for selected square
  const selectedSquareLegalMoves = useMemo(() => {
    if (!selectedSquare || !showLegalMoves) return [];
    return getLegalMoves(selectedSquare).map(move => move.to);
  }, [selectedSquare, showLegalMoves, getLegalMoves]);

  // Render square
  const renderSquare = useCallback((square: Square) => {
    const piece = getPieceAt(square);
    const isLight = isLightSquare(square);
    const isSelected = selectedSquare === square;
    const isLastMoveFrom = lastMove?.from === square;
    const isLastMoveTo = lastMove?.to === square;
    const isLegalMove = selectedSquareLegalMoves.includes(square);
    const isDragOver = dragOverSquare === square;
    const isDragged = draggedSquare === square;

    return (
      <div
        key={square}
        className={clsx(
          'relative flex items-center justify-center cursor-pointer select-none transition-all duration-200',
          isLight ? 'bg-board-classic-light' : 'bg-board-classic-dark',
          isSelected && 'ring-2 ring-yellow-400 ring-opacity-75',
          isLastMoveFrom && 'bg-yellow-200 dark:bg-yellow-800',
          isLastMoveTo && 'bg-yellow-200 dark:bg-yellow-800',
          isDragOver && 'bg-blue-200 dark:bg-blue-800',
          isDragged && 'opacity-50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={() => handleSquareClick(square)}
        onDragStart={(e) => handleDragStart(e, square)}
        onDragOver={(e) => handleDragOver(e, square)}
        onDrop={(e) => handleDrop(e, square)}
        onDragEnd={handleDragEnd}
        draggable={!disabled && !!piece}
      >
        {/* Legal move indicator */}
        {isLegalMove && (
          <div className="absolute w-3 h-3 bg-green-500 rounded-full opacity-70" />
        )}
        
        {/* Piece */}
        {piece && (
          <span className="text-4xl font-bold">
            {piece}
          </span>
        )}
        
        {/* Check indicator */}
        {inCheck && piece?.toLowerCase() === 'k' && (
          <div className="absolute inset-0 bg-red-500 rounded opacity-50 animate-check-pulse" />
        )}
        
        {/* Square coordinates */}
        {showCoordinates && (
          <div className="absolute bottom-0 right-0 text-xs text-gray-600 dark:text-gray-400 p-1">
            {square}
          </div>
        )}
      </div>
    );
  }, [
    getPieceAt,
    selectedSquare,
    lastMove,
    selectedSquareLegalMoves,
    dragOverSquare,
    draggedSquare,
    inCheck,
    showCoordinates,
    disabled,
    handleSquareClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  ]);

  // Render board
  const renderBoard = useCallback(() => {
    const squares: Square[] = [];
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = coordsToSquare(file, rank);
        squares.push(square);
      }
    }

    return squares.map(renderSquare);
  }, [renderSquare]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 dark:border-gray-200 rounded-lg overflow-hidden">
        {renderBoard()}
      </div>
    </div>
  );
};

export default ChessBoard;