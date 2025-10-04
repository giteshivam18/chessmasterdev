import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChessBoard from './ChessBoard';
import GameSidebar from './GameSidebar';
import GameTopBar from './GameTopBar';
import { useGameStore } from '../store/useGameStore';
import { useSocket } from '../hooks/useSocket';

interface GameInterfaceProps {
  isSpectating?: boolean;
  onBack: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ isSpectating = false, onBack }) => {
  const { currentGame, playerColor, settings } = useGameStore();
  const { makeMove, resign, offerDraw, respondDraw } = useSocket();
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: string; to: string } | null>(null);

  // Handle promotion
  const handlePromotion = (piece: string) => {
    if (pendingMove) {
      makeMove(pendingMove.from, pendingMove.to, piece);
      setPendingMove(null);
      setShowPromotionModal(false);
    }
  };

  // Check for promotion needs
  useEffect(() => {
    if (currentGame && currentGame.gameStatus === 'playing') {
      // This would be handled by the chess engine
      // For now, we'll use the default queen promotion
    }
  }, [currentGame]);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <GameTopBar
        isSpectating={isSpectating}
        onBack={onBack}
        onResign={resign}
        onOfferDraw={offerDraw}
        onRespondDraw={respondDraw}
      />

      {/* Main Game Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chess Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-center"
          >
            <div className="chess-board-container">
              <ChessBoard size={Math.min(window.innerWidth - 100, 600)} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-80"
          >
            <GameSidebar isSpectating={isSpectating} />
          </motion.div>
        </div>
      </div>

      {/* Promotion Modal */}
      {showPromotionModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Choose Promotion Piece
            </h3>
            <div className="flex space-x-4">
              {['q', 'r', 'b', 'n'].map((piece) => (
                <motion.button
                  key={piece}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePromotion(piece)}
                  className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center text-3xl hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                >
                  {playerColor === 'white' 
                    ? ['♕', '♖', '♗', '♘'][['q', 'r', 'b', 'n'].indexOf(piece)]
                    : ['♛', '♜', '♝', '♞'][['q', 'r', 'b', 'n'].indexOf(piece)]
                  }
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Game Over Modal */}
      {currentGame.gameStatus === 'finished' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-md mx-4"
          >
            <div className="text-6xl mb-4">
              {currentGame.winner === playerColor ? '🎉' : 
               currentGame.winner ? '😞' : '🤝'}
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              {currentGame.winner === playerColor ? 'You Won!' :
               currentGame.winner ? 'You Lost!' : 'Draw!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {currentGame.reason === 'checkmate' && 'Checkmate!'}
              {currentGame.reason === 'timeout' && 'Time out!'}
              {currentGame.reason === 'resignation' && 'Opponent resigned!'}
              {currentGame.reason === 'draw' && 'Draw by agreement!'}
              {currentGame.reason === 'stalemate' && 'Stalemate!'}
            </p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                New Game
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GameInterface;