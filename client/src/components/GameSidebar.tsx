import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

interface GameSidebarProps {
  isSpectating?: boolean;
}

const GameSidebar: React.FC<GameSidebarProps> = ({ isSpectating = false }) => {
  const { currentGame, playerColor, gameHistory, settings } = useGameStore();

  if (!currentGame) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlayerInfo = (color: 'white' | 'black') => {
    const player = currentGame.players[color];
    return {
      name: player?.name || 'Waiting...',
      isCurrentPlayer: currentGame.turn === (color === 'white' ? 'w' : 'b'),
      isMyColor: playerColor === color,
    };
  };

  const whitePlayer = getPlayerInfo('white');
  const blackPlayer = getPlayerInfo('black');

  return (
    <div className="space-y-6">
      {/* Players Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Players
        </h3>

        {/* White Player */}
        <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${
          whitePlayer.isCurrentPlayer ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg border-2 border-gray-300">
              ♔
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                {whitePlayer.name}
              </div>
              {whitePlayer.isMyColor && (
                <div className="text-xs text-amber-600 dark:text-amber-400">You</div>
              )}
            </div>
          </div>
          <div className={`text-lg font-mono ${
            whitePlayer.isCurrentPlayer ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {formatTime(currentGame.timers.white)}
          </div>
        </div>

        {/* Black Player */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          blackPlayer.isCurrentPlayer ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-lg border-2 border-gray-300">
              ♚
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                {blackPlayer.name}
              </div>
              {blackPlayer.isMyColor && (
                <div className="text-xs text-amber-600 dark:text-amber-400">You</div>
              )}
            </div>
          </div>
          <div className={`text-lg font-mono ${
            blackPlayer.isCurrentPlayer ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {formatTime(currentGame.timers.black)}
          </div>
        </div>
      </motion.div>

      {/* Game Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Game Status
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`font-medium ${
              currentGame.gameStatus === 'playing' ? 'text-green-600 dark:text-green-400' :
              currentGame.gameStatus === 'waiting' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {currentGame.gameStatus === 'playing' ? 'Playing' :
               currentGame.gameStatus === 'waiting' ? 'Waiting' : 'Finished'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Turn:</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {currentGame.turn === 'w' ? 'White' : 'Black'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Time Control:</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {currentGame.timeControl.minutes}+{currentGame.timeControl.increment}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Move History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Move History
        </h3>
        
        <div className="max-h-64 overflow-y-auto space-y-1">
          {gameHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No moves yet</p>
          ) : (
            gameHistory.map((move, index) => (
              <div key={index} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.floor(index / 2) + 1}.
                  {index % 2 === 0 ? '' : '..'}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {move.san}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Captured Pieces */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Captured Pieces
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">White</div>
            <div className="flex flex-wrap gap-1">
              {/* This would be populated with actual captured pieces */}
              <span className="text-gray-400 text-sm">None</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Black</div>
            <div className="flex flex-wrap gap-1">
              {/* This would be populated with actual captured pieces */}
              <span className="text-gray-400 text-sm">None</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spectator Notice */}
      {isSpectating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="text-blue-600 dark:text-blue-400">👁️</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              You are spectating this game
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameSidebar;