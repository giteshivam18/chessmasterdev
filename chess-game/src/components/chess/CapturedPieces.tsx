import React from 'react';
import { clsx } from 'clsx';
import type { PieceType } from '../../types/chess.types';
import { getPieceSymbol, getPieceValue, calculateMaterialAdvantage } from '../../utils/chessHelpers';

export interface CapturedPiecesProps {
  capturedWhite: PieceType[];
  capturedBlack: PieceType[];
  className?: string;
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  capturedWhite,
  capturedBlack,
  className,
}) => {
  // Group pieces by type and sort by value
  const groupPieces = (pieces: PieceType[]) => {
    const grouped: Record<PieceType, number> = {
      'q': 0,
      'r': 0,
      'b': 0,
      'n': 0,
      'p': 0,
      'k': 0,
    };

    pieces.forEach(piece => {
      if (piece !== 'k') { // King is never captured
        grouped[piece]++;
      }
    });

    return grouped;
  };

  const whiteGrouped = groupPieces(capturedWhite);
  const blackGrouped = groupPieces(capturedBlack);
  const materialAdvantage = calculateMaterialAdvantage(capturedWhite, capturedBlack);

  const renderCapturedPieces = (_pieces: PieceType[], color: 'w' | 'b') => {
    const grouped = color === 'w' ? blackGrouped : whiteGrouped;
    const piecesToShow: { piece: PieceType; count: number }[] = [];

    // Add pieces in order of value (Q, R, B, N, P)
    (['q', 'r', 'b', 'n', 'p'] as PieceType[]).forEach(piece => {
      if (grouped[piece] > 0) {
        piecesToShow.push({ piece, count: grouped[piece] });
      }
    });

    return (
      <div className="flex flex-wrap gap-1">
        {piecesToShow.map(({ piece, count }) => (
          <div key={piece} className="flex items-center">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="text-2xl opacity-70 hover:opacity-100 transition-opacity"
                title={`${piece.toUpperCase()} (${getPieceValue(piece)} points)`}
              >
                {getPieceSymbol(piece, color)}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Material Advantage */}
      {materialAdvantage !== 0 && (
        <div className="text-center">
          <div
            className={clsx(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              materialAdvantage > 0
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            )}
          >
            {materialAdvantage > 0 ? '+' : ''}{materialAdvantage}
          </div>
        </div>
      )}

      {/* Captured Pieces */}
      <div className="space-y-3">
        {/* White's captured pieces (black pieces) */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            White captured:
          </div>
          <div className="min-h-[2rem] flex items-center">
            {capturedWhite.length > 0 ? (
              renderCapturedPieces(capturedWhite, 'b')
            ) : (
              <span className="text-gray-400 dark:text-gray-600 text-sm">
                No pieces captured
              </span>
            )}
          </div>
        </div>

        {/* Black's captured pieces (white pieces) */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Black captured:
          </div>
          <div className="min-h-[2rem] flex items-center">
            {capturedBlack.length > 0 ? (
              renderCapturedPieces(capturedBlack, 'w')
            ) : (
              <span className="text-gray-400 dark:text-gray-600 text-sm">
                No pieces captured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Piece Values Legend */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="font-medium">Piece Values:</div>
        <div className="grid grid-cols-2 gap-1">
          <div>Queen: 9</div>
          <div>Rook: 5</div>
          <div>Bishop: 3</div>
          <div>Knight: 3</div>
          <div>Pawn: 1</div>
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces;