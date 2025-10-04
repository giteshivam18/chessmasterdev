import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useGameStore } from '../store/useGameStore';

interface GameSelectionProps {
  onBack: () => void;
  onGameStart: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ onBack, onGameStart }) => {
  const { createRoom, joinRoom } = useSocket();
  const { playerName, settings, updateSettings } = useGameStore();
  
  const [roomId, setRoomId] = useState('');
  const [preferredColor, setPreferredColor] = useState<'white' | 'black' | 'random'>('random');
  const [timeControl, setTimeControl] = useState(settings.timeControl);

  const timeControlOptions = [
    { label: '1+0', minutes: 1, increment: 0 },
    { label: '3+0', minutes: 3, increment: 0 },
    { label: '5+0', minutes: 5, increment: 0 },
    { label: '10+0', minutes: 10, increment: 0 },
    { label: '15+10', minutes: 15, increment: 10 },
    { label: '30+0', minutes: 30, increment: 0 },
  ];

  const handleCreateRoom = () => {
    updateSettings({ timeControl, preferredColor });
    createRoom(playerName, timeControl);
    onGameStart();
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      updateSettings({ preferredColor });
      joinRoom(roomId, playerName, preferredColor === 'random' ? undefined : preferredColor);
      onGameStart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-4 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium"
        >
          ← Back to Home
        </motion.button>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Choose Your Game
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create a new room or join an existing game
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Room */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Create New Room
          </h2>

          {/* Time Control Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Time Control
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeControlOptions.map((option) => (
                <motion.button
                  key={option.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeControl({ minutes: option.minutes, increment: option.increment })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    timeControl.minutes === option.minutes && timeControl.increment === option.increment
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-amber-300'
                  }`}
                >
                  <div className="font-medium text-gray-800 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {option.minutes} min{option.increment > 0 && ` + ${option.increment}s`}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Preference */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Color Preference
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'white', label: 'White', icon: '♔' },
                { value: 'black', label: 'Black', icon: '♚' },
                { value: 'random', label: 'Random', icon: '🎲' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreferredColor(option.value as any)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    preferredColor === option.value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-amber-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {option.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateRoom}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
          >
            Create Room
          </motion.button>
        </motion.div>

        {/* Join Room */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Join Existing Room
          </h2>

          {/* Room ID Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-amber-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Color Preference for Joining */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preferred Color
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'white', label: 'White', icon: '♔' },
                { value: 'black', label: 'Black', icon: '♚' },
                { value: 'random', label: 'Random', icon: '🎲' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreferredColor(option.value as any)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    preferredColor === option.value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-amber-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {option.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinRoom}
            disabled={!roomId.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
          >
            Join Room
          </motion.button>
        </motion.div>
      </div>

      {/* Quick Match Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Quick Match</h3>
          <p className="text-purple-100 mb-4">
            Get matched with a random opponent instantly
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRoom}
            className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Find Opponent
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameSelection;