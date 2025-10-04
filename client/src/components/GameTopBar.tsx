import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

interface GameTopBarProps {
  isSpectating?: boolean;
  onBack: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onRespondDraw: (accept: boolean) => void;
}

const GameTopBar: React.FC<GameTopBarProps> = ({
  isSpectating = false,
  onBack,
  onResign,
  onOfferDraw,
  onRespondDraw,
}) => {
  const { currentGame, drawOffer, playerColor } = useGameStore();

  const handleResign = () => {
    if (window.confirm('Are you sure you want to resign?')) {
      onResign();
    }
  };

  const handleOfferDraw = () => {
    if (window.confirm('Offer a draw to your opponent?')) {
      onOfferDraw();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium"
            >
              ← Back
            </motion.button>
            
            {currentGame && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Room: <span className="font-mono text-gray-800 dark:text-white">{currentGame.id.slice(0, 8)}</span>
              </div>
            )}
          </div>

          {/* Center Section - Game Mode */}
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {isSpectating ? 'Spectating' : 'Chess Game'}
            </h1>
            {currentGame && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentGame.timeControl.minutes}+{currentGame.timeControl.increment}
              </div>
            )}
          </div>

          {/* Right Section - Game Controls */}
          <div className="flex items-center space-x-2">
            {!isSpectating && currentGame && currentGame.gameStatus === 'playing' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOfferDraw}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Offer Draw
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResign}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Resign
                </motion.button>
              </>
            )}

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Draw Offer Notification */}
      {drawOffer && drawOffer.pending && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-blue-800 dark:text-blue-200">
                <strong>{drawOffer.from === playerColor ? 'You' : 'Opponent'}</strong> offered a draw
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRespondDraw(true)}
                  className="px-4 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                >
                  Accept
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRespondDraw(false)}
                  className="px-4 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Decline
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameTopBar;