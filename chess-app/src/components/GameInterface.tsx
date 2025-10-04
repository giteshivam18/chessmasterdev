import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatTime } from '../utils/chessUtils';
import { soundManager } from '../utils/soundManager';
import ChessBoard from './ChessBoard';
import { Square } from '../types';

const GameInterface: React.FC = () => {
  const navigate = useNavigate();
  const { currentRoom, gameState, updateGameState } = useGameStore();
  const { settings } = useSettingsStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!currentRoom) {
      navigate('/');
      return;
    }

    // Update game state from room
    updateGameState(currentRoom.gameState);
  }, [currentRoom, updateGameState, navigate]);

  useEffect(() => {
    // Update sound settings
    soundManager.updateFromSettings();
  }, [settings]);

  const handleMove = (from: Square, to: Square) => {
    // This will be implemented with socket.io for real-time multiplayer
    console.log('Move made:', from, 'to', to);
  };

  const handleResign = () => {
    soundManager.play('button');
    // Implement resign logic
    console.log('Player resigned');
  };

  const handleOfferDraw = () => {
    soundManager.play('button');
    // Implement draw offer logic
    console.log('Draw offered');
  };

  const handleNewGame = () => {
    soundManager.play('button');
    navigate('/game-selection');
  };

  if (!currentRoom || !gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
            
            <div>
              <h1 className="text-xl font-bold">{currentRoom.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              {formatTime(gameState.timeLeft.white)} | {formatTime(gameState.timeLeft.black)}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <ChessBoard
              size={Math.min(window.innerWidth * 0.6, window.innerHeight * 0.7, 600)}
              onMove={handleMove}
            />
            
            {/* Game Status Overlay */}
            {gameState.gameStatus === 'finished' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {gameState.winner === 'w' ? '♔' : gameState.winner === 'b' ? '♚' : '🤝'}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {gameState.winner === 'w' ? 'White Wins!' : 
                     gameState.winner === 'b' ? 'Black Wins!' : 'Draw!'}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {gameState.isCheckmate ? 'Checkmate!' : 
                     gameState.isStalemate ? 'Stalemate!' : 'Game Over'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewGame}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-full"
                  >
                    New Game
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: isSidebarOpen ? 0 : 300 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
        >
          {/* Player Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="space-y-4">
              {/* White Player */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold">
                  ♔
                </div>
                <div className="flex-1">
                  <div className="font-semibold">White Player</div>
                  <div className="text-sm text-gray-400">Rating: 1200</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-green-400">
                    {formatTime(gameState.timeLeft.white)}
                  </div>
                </div>
              </div>

              {/* Black Player */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-600">
                  ♚
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Black Player</div>
                  <div className="text-sm text-gray-400">Rating: 1200</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-green-400">
                    {formatTime(gameState.timeLeft.black)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captured Pieces */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold mb-3">Captured Pieces</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-gray-400">White captured:</span>
                {gameState.capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-lg">
                    {piece}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-gray-400">Black captured:</span>
                {gameState.capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-lg">
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Move History */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-3">Move History</h3>
            <div className="space-y-1 font-mono text-sm">
              {gameState.moveHistory.length === 0 ? (
                <div className="text-gray-400">No moves yet</div>
              ) : (
                gameState.moveHistory.map((move, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-400">{Math.floor(index / 2) + 1}.</span>
                    <span>{move}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Game Controls */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResign}
              className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Resign
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOfferDraw}
              className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Offer Draw
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewGame}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              New Game
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameInterface;
