import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import Modal from '../ui/Modal';
import type { Square, PieceType, PieceColor } from '../../types/chess.types';
import { getPieceSymbol } from '../../utils/chessHelpers';

export interface PromotionDialogProps {
  isOpen: boolean;
  onSelect: (piece: PieceType) => void;
  square: Square;
  color: PieceColor;
  className?: string;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  onSelect,
  square,
  color,
  className,
}) => {
  const promotionPieces: PieceType[] = ['q', 'r', 'b', 'n'];

  // Auto-select Queen after 5 seconds if not manually selected
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onSelect('q');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onSelect]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const pieceMap: Record<string, PieceType> = {
        'q': 'q',
        'r': 'r',
        'b': 'b',
        'n': 'n',
      };

      if (pieceMap[key]) {
        onSelect(pieceMap[key]);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onSelect]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot close without selecting
      size="sm"
      closeOnOverlayClick={false}
      closeOnEscape={false}
      showCloseButton={false}
      className={className}
    >
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          Promote Pawn
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Choose a piece to promote to on {square}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {promotionPieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className={clsx(
                'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500',
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              )}
            >
              <span className="text-4xl mb-2">
                {getPieceSymbol(piece, color)}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {piece === 'q' ? 'Queen' : 
                 piece === 'r' ? 'Rook' : 
                 piece === 'b' ? 'Bishop' : 'Knight'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Press {piece.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Auto-selects Queen in 5 seconds
        </div>
      </div>
    </Modal>
  );
};

export default PromotionDialog;