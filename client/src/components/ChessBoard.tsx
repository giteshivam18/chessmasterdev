import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { useGameStore } from '../store/useGameStore';
import { useSocket } from '../hooks/useSocket';

interface ChessBoardProps {
  size?: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ size = 400 }) => {
  const {
    currentGame,
    playerColor,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck,
    isCheckmate,
    isStalemate,
    setSelectedSquare,
    setLegalMoves,
    clearSelection,
  } = useGameStore();

  const { makeMove } = useSocket();
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<string | null>(null);

  const chess = currentGame ? new Chess(currentGame.fen) : new Chess();

  const squareSize = size / 8;


  const getSquareName = (row: number, col: number): string => {
    const files = 'abcdefgh';
    const ranks = '87654321';
    return `${files[col]}${ranks[row]}`;
  };

  const getPieceSymbol = (piece: string): string => {
    const symbols: { [key: string]: string } = {
      'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
      'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
    };
    return symbols[piece] || '';
  };

  const isLegalMove = (square: string): boolean => {
    return legalMoves.includes(square);
  };

  const isLastMove = (square: string): boolean => {
    return !!(lastMove && (lastMove.from === square || lastMove.to === square));
  };

  const isSelected = (square: string): boolean => {
    return selectedSquare === square;
  };

  const isInCheck = (square: string): boolean => {
    if (!isCheck) return false;
    const piece = chess.get(square as any);
    return !!(piece && piece.type === 'k' && piece.color === chess.turn());
  };

  const handleSquareClick = (square: string) => {
    if (!currentGame || currentGame.gameStatus !== 'playing') return;
    if (playerColor && chess.turn() !== (playerColor === 'white' ? 'w' : 'b')) return;

    const piece = chess.get(square as any);
    
    if (selectedSquare) {
      if (selectedSquare === square) {
        clearSelection();
        return;
      }

      if (isLegalMove(square)) {
        // Make the move
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // Default to queen promotion
        });

        if (move) {
          makeMove(selectedSquare, square, move.promotion);
          clearSelection();
        }
      } else if (piece && piece.color === chess.turn()) {
        // Select new piece
        setSelectedSquare(square);
        const moves = chess.moves({ square: square as any, verbose: true });
        setLegalMoves(moves.map((move: any) => move.to));
      } else {
        clearSelection();
      }
    } else if (piece && piece.color === chess.turn()) {
      // Select piece
      setSelectedSquare(square);
      const moves = chess.moves({ square: square as any, verbose: true });
      setLegalMoves(moves.map((move: any) => move.to));
    }
  };

  const handleDragStart = (e: React.DragEvent, square: string) => {
    if (!currentGame || currentGame.gameStatus !== 'playing') return;
    if (playerColor && chess.turn() !== (playerColor === 'white' ? 'w' : 'b')) return;

    const piece = chess.get(square as any);
    if (piece && piece.color === chess.turn()) {
      setDraggedPiece(square);
      setSelectedSquare(square);
      const moves = chess.moves({ square: square as any, verbose: true });
      setLegalMoves(moves.map((move: any) => move.to));
    }
  };

  const handleDragOver = (e: React.DragEvent, square: string) => {
    e.preventDefault();
    setDragOverSquare(square);
  };

  const handleDrop = (e: React.DragEvent, square: string) => {
    e.preventDefault();
    
    if (draggedPiece && isLegalMove(square)) {
      const move = chess.move({
        from: draggedPiece,
        to: square,
        promotion: 'q',
      });

      if (move) {
        makeMove(draggedPiece, square, move.promotion);
      }
    }

    setDraggedPiece(null);
    setDragOverSquare(null);
    clearSelection();
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setDragOverSquare(null);
  };

  const renderSquare = (row: number, col: number) => {
    const square = getSquareName(row, col);
    const piece = chess.get(square as any);
    const isLight = (row + col) % 2 === 0;
    
    return (
      <div
        key={square}
        className={`chess-square ${isLight ? 'bg-amber-100' : 'bg-amber-800'} ${
          isSelected(square) ? 'selected' : ''
        } ${isLastMove(square) ? 'last-move' : ''} ${
          isInCheck(square) ? 'check' : ''
        } ${dragOverSquare === square ? 'bg-blue-300' : ''}`}
        style={{
          width: squareSize,
          height: squareSize,
          position: 'relative',
        }}
        onClick={() => handleSquareClick(square)}
        onDragStart={(e) => handleDragStart(e, square)}
        onDragOver={(e) => handleDragOver(e, square)}
        onDrop={(e) => handleDrop(e, square)}
        onDragEnd={handleDragEnd}
        draggable={!!piece && piece.color === chess.turn()}
      >
        {piece && (
          <div
            className="chess-piece"
            style={{
              fontSize: squareSize * 0.6,
              userSelect: 'none',
            }}
          >
            {getPieceSymbol(piece.color + piece.type.toUpperCase())}
          </div>
        )}
        
        {isLegalMove(square) && (
          <div
            className="legal-move"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        squares.push(renderSquare(row, col));
      }
    }
    return squares;
  };

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-gray-500">No game in progress</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="grid grid-cols-8 border-2 border-gray-800"
        style={{ width: size, height: size }}
      >
        {renderBoard()}
      </div>
      
      {/* Game status overlay */}
      {(isCheckmate || isStalemate) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">
              {isCheckmate ? 'Checkmate!' : 'Stalemate!'}
            </h3>
            <p className="text-gray-600">
              {isCheckmate 
                ? `${currentGame.winner === playerColor ? 'You won!' : 'You lost!'}`
                : 'Draw by stalemate'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;