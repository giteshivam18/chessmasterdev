import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartGame: () => void;
  onJoinGame: () => void;
  onSpectate: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  playerName,
  onPlayerNameChange,
  onStartGame,
  onJoinGame,
  onSpectate,
}) => {
  const chessPieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white mb-4">
          Chess
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Real-time multiplayer chess game
        </p>
        
        {/* Animated Chess Pieces */}
        <div className="flex justify-center space-x-4 mb-8">
          {chessPieces.map((piece, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 2
              }}
              className="text-4xl md:text-5xl"
            >
              {piece}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Player Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-md mb-8"
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-amber-500 dark:bg-gray-700 dark:text-white"
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col md:flex-row gap-4 w-full max-w-md"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
          disabled={!playerName.trim()}
          className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          Play Now
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onJoinGame}
          disabled={!playerName.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          Join Game
        </motion.button>
      </motion.div>

      {/* Spectate Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSpectate}
        className="mt-4 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Spectate Games
      </motion.button>

      {/* Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
      >
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Real-time</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Play with friends in real-time with instant move synchronization
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Smart Features</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Legal move validation, timer controls, and game analysis
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Beautiful UI</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Modern design with smooth animations and responsive layout
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;