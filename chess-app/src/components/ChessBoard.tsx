import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { ChessGame, getSquareColor, getPieceSymbol, getSquareFromPosition } from '../utils/chessUtils';
import { Square } from '../types';
import { soundManager } from '../utils/soundManager';

interface ChessBoardProps {
  size?: number;
  onMove?: (from: Square, to: Square) => void;
  disabled?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  size = 400, 
  onMove,
  disabled = false 
}) => {
  const { gameState, selectedSquare, legalMoves, setSelectedSquare, setLegalMoves, makeMove } = useGameStore();
  const { settings } = useSettingsStore();
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const [chessGame, setChessGame] = useState<ChessGame | null>(null);

  useEffect(() => {
    if (gameState) {
      const game = new ChessGame(gameState.board);
      setChessGame(game);
    }
  }, [gameState]);

  const handleSquareClick = (square: Square) => {
    if (disabled || !chessGame) return;

    soundManager.play('button');

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (selectedSquare && legalMoves.includes(square)) {
      // Make the move
      const result = chessGame.makeMove({ from: selectedSquare, to: square });
      if (result.success) {
        soundManager.play('move');
        if (result.isCheck) soundManager.play('check');
        if (result.isCheckmate) soundManager.play('checkmate');
        
        makeMove(selectedSquare, square);
        onMove?.(selectedSquare, square);
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        soundManager.play('error');
      }
    } else {
      // Select piece
      const piece = chessGame.getBoard().find(row => 
        row.find(cell => cell && cell.square === square)
      )?.find(cell => cell && cell.square === square);
      
      if (piece && piece.color === gameState?.turn) {
        setSelectedSquare(square);
        const moves = chessGame.getLegalMoves(square);
        setLegalMoves(moves);
      }
    }
  };

  const handlePieceDragStart = (e: React.DragEvent<HTMLDivElement>, piece: string, square: Square) => {
    if (disabled || !chessGame || gameState?.turn !== piece[0]) return;
    
    setDraggedPiece(piece);
    setSelectedSquare(square);
    const moves = chessGame.getLegalMoves(square);
    setLegalMoves(moves);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  const handlePieceDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggedPiece || !selectedSquare) return;

    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const targetSquare = getSquareFromPosition(x, y, size);

    if (targetSquare && legalMoves.includes(targetSquare)) {
      const result = chessGame?.makeMove({ from: selectedSquare, to: targetSquare });
      if (result?.success) {
        soundManager.play('move');
        if (result.isCheck) soundManager.play('check');
        if (result.isCheckmate) soundManager.play('checkmate');
        
        makeMove(selectedSquare, targetSquare);
        onMove?.(selectedSquare, targetSquare);
      }
    }

    setDraggedPiece(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const renderSquare = (square: Square, piece: string | null) => {
    const isLight = getSquareColor(square) === 'light';
    const isSelected = selectedSquare === square;
    const isLegalMove = legalMoves.includes(square);
    const isLastMove = gameState?.lastMove?.includes(square);
    const isCheck = gameState?.isCheck && piece?.includes('K') && piece[0] === gameState.turn;

    return (
      <motion.div
        key={square}
        className={`chess-square ${isLight ? 'light' : 'dark'} ${
          isSelected ? 'highlighted' : ''
        } ${isLastMove ? 'last-move' : ''} ${isCheck ? 'check' : ''}`}
        style={{ width: size / 8, height: size / 8 }}
        onClick={() => handleSquareClick(square)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.1 }}
      >
        {/* Legal move indicator */}
        {isLegalMove && (
          <motion.div
            className={`move-indicator ${piece ? 'capture' : ''}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Piece */}
        {piece && (
          <div
            className={`chess-piece ${draggedPiece === piece ? 'dragging' : ''}`}
            draggable={!disabled && piece[0] === gameState?.turn}
            onDragStart={(e) => handlePieceDragStart(e, piece, square)}
            onDragEnd={handlePieceDragEnd}
          >
            <motion.span 
              className="text-4xl select-none block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={isCheck ? { 
                scale: [1, 1.1, 1],
                transition: { duration: 0.5, repeat: Infinity }
              } : {}}
            >
              {getPieceSymbol(piece)}
            </motion.span>
          </div>
        )}

        {/* Coordinates */}
        {settings.showCoordinates && (
          <div className="absolute bottom-0 right-0 text-xs text-gray-600 pointer-events-none">
            {square}
          </div>
        )}
      </motion.div>
    );
  };

  const renderBoard = () => {
    if (!chessGame || !gameState) return null;

    const board = chessGame.getBoard();
    const squares: React.JSX.Element[] = [];

    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const square = String.fromCharCode(97 + file) + (rank + 1) as Square;
        const piece = board[7 - rank][file];
        squares.push(renderSquare(square, piece ? piece.type + piece.color : null));
      }
    }

    return squares;
  };

  return (
    <div className="relative">
      <div
        ref={boardRef}
        className="relative grid grid-cols-8 border-2 border-gray-800 shadow-2xl"
        style={{ width: size, height: size }}
      >
        {renderBoard()}
      </div>

      {/* Dragged piece overlay */}
      <AnimatePresence>
        {draggedPiece && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: `calc(50% + ${dragOffset.x}px)`,
              top: `calc(50% + ${dragOffset.y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <span className="text-4xl">
              {getPieceSymbol(draggedPiece)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChessBoard;
