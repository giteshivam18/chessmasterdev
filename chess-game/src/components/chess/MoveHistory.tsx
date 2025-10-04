import React, { useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import type { Move } from '../../types/chess.types';
import Button from '../ui/Button';
import { Copy, Download } from 'lucide-react';

export interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveClick?: (index: number) => void;
  onExportPGN?: () => void;
  className?: string;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onMoveClick,
  onExportPGN,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current move
  useEffect(() => {
    if (scrollRef.current) {
      const currentElement = scrollRef.current.querySelector(`[data-move-index="${currentMoveIndex}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentMoveIndex]);

  // Group moves into pairs (white + black)
  const movePairs = React.useMemo(() => {
    const pairs: { white: Move | null; black: Move | null; pairNumber: number }[] = [];
    
    for (let i = 0; i < moves.length; i += 2) {
      pairs.push({
        white: moves[i] || null,
        black: moves[i + 1] || null,
        pairNumber: Math.floor(i / 2) + 1,
      });
    }
    
    return pairs;
  }, [moves]);

  // Copy moves to clipboard
  const copyMoves = () => {
    const moveText = moves.map(move => move.san).join(' ');
    navigator.clipboard.writeText(moveText);
  };

  // Export to PGN
  const handleExportPGN = () => {
    if (onExportPGN) {
      onExportPGN();
    } else {
      // Default PGN export
      const pgn = moves.map(move => move.san).join(' ');
      const blob = new Blob([pgn], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game.pgn';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={clsx('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Move History
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyMoves}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportPGN}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Moves List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-1"
      >
        {movePairs.map((pair, index) => (
          <div
            key={pair.pairNumber}
            className="flex items-center space-x-2 text-sm"
          >
            {/* Move number */}
            <span className="w-8 text-gray-500 dark:text-gray-400 font-mono">
              {pair.pairNumber}.
            </span>
            
            {/* White move */}
            {pair.white && (
              <button
                data-move-index={index * 2}
                className={clsx(
                  'px-2 py-1 rounded text-left min-w-0 flex-1',
                  currentMoveIndex === index * 2
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                )}
                onClick={() => onMoveClick?.(index * 2)}
              >
                {pair.white.san}
              </button>
            )}
            
            {/* Black move */}
            {pair.black && (
              <button
                data-move-index={index * 2 + 1}
                className={clsx(
                  'px-2 py-1 rounded text-left min-w-0 flex-1',
                  currentMoveIndex === index * 2 + 1
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                )}
                onClick={() => onMoveClick?.(index * 2 + 1)}
              >
                {pair.black.san}
              </button>
            )}
          </div>
        ))}
        
        {moves.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No moves yet
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;