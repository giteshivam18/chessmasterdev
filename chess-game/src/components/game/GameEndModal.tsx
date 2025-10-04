import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  AlertCircle, 
  Handshake, 
  RotateCcw, 
  Play, 
  BarChart3,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { GameResult } from '../../types/chess.types';

export interface GameEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GameResult;
  gameData?: {
    duration: number;
    moves: number;
    opponent: string;
    mode: string;
  };
  onRematch?: () => void;
  onNewGame?: () => void;
  onAnalyze?: () => void;
  className?: string;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  onClose,
  result,
  gameData,
  onRematch,
  onNewGame,
  onAnalyze,
  className,
}) => {
  // Confetti effect for victory
  useEffect(() => {
    if (isOpen && result.result === 'win') {
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
        });

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, result.result]);

  const getResultConfig = () => {
    switch (result.result) {
      case 'win':
        return {
          icon: Trophy,
          title: 'Victory!',
          message: 'Congratulations on your win!',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-500',
        };
      case 'loss':
        return {
          icon: AlertCircle,
          title: 'Defeat',
          message: 'Better luck next time!',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          iconColor: 'text-gray-500',
        };
      case 'draw':
        return {
          icon: Handshake,
          title: 'Draw',
          message: 'The game ended in a draw',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          iconColor: 'text-blue-500',
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Game Ended',
          message: 'The game has ended',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          iconColor: 'text-gray-500',
        };
    }
  };

  const getReasonText = () => {
    switch (result.reason) {
      case 'checkmate':
        return 'Checkmate';
      case 'timeout':
        return 'Time expired';
      case 'resignation':
        return 'Opponent resigned';
      case 'stalemate':
        return 'Stalemate';
      case 'agreement':
        return 'Draw by agreement';
      case 'repetition':
        return 'Threefold repetition';
      case '50move':
        return '50-move rule';
      default:
        return 'Game ended';
    }
  };

  const config = getResultConfig();
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="text-center space-y-6"
      >
        {/* Icon and Title */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={clsx(
              'w-20 h-20 mx-auto rounded-full flex items-center justify-center',
              config.bgColor
            )}
          >
            <Icon className={clsx('w-10 h-10', config.iconColor)} />
          </motion.div>

          <div>
            <h2 className={clsx('text-3xl font-bold', config.color)}>
              {config.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              {config.message}
            </p>
          </div>
        </div>

        {/* Game Details */}
        {gameData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getReasonText()}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="ml-2 font-medium">
                  {Math.floor(gameData.duration / 60000)}:{(gameData.duration % 60000 / 1000).toFixed(0).padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Moves:</span>
                <span className="ml-2 font-medium">{gameData.moves}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Opponent:</span>
                <span className="ml-2 font-medium">{gameData.opponent}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Mode:</span>
                <span className="ml-2 font-medium">{gameData.mode}</span>
              </div>
            </div>
          </div>
        )}

        {/* ELO Change */}
        {result.eloChange && (
          <div className={clsx(
            'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
            result.eloChange > 0
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          )}>
            ELO {result.eloChange > 0 ? '+' : ''}{result.eloChange}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRematch && (
            <Button
              variant="primary"
              onClick={onRematch}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Rematch
            </Button>
          )}
          
          {onNewGame && (
            <Button
              variant="secondary"
              onClick={onNewGame}
              leftIcon={<Play className="w-4 h-4" />}
            >
              New Game
            </Button>
          )}
          
          {onAnalyze && (
            <Button
              variant="outline"
              onClick={onAnalyze}
              leftIcon={<BarChart3 className="w-4 h-4" />}
            >
              Analyze
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={onClose}
            leftIcon={<X className="w-4 h-4" />}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default GameEndModal;