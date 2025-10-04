import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundManager';
import { GameMode } from '../types';

const GameSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRoom } = useGameStore();
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [timeControl, setTimeControl] = useState({ initial: 600, increment: 10 });
  const [colorPreference, setColorPreference] = useState<'white' | 'black' | 'random'>('random');

  const gameModes: GameMode[] = [
    {
      id: 'blitz',
      name: 'Blitz',
      description: 'Fast-paced 5+3 games',
      timeControl: { initial: 300, increment: 3 },
      icon: '⚡',
      isPopular: true,
    },
    {
      id: 'rapid',
      name: 'Rapid',
      description: 'Classic 10+5 games',
      timeControl: { initial: 600, increment: 5 },
      icon: '🏃',
      isPopular: true,
    },
    {
      id: 'classical',
      name: 'Classical',
      description: 'Long 30+0 games',
      timeControl: { initial: 1800, increment: 0 },
      icon: '♔',
    },
    {
      id: 'bullet',
      name: 'Bullet',
      description: 'Lightning 1+0 games',
      timeControl: { initial: 60, increment: 0 },
      icon: '💨',
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Set your own time',
      timeControl: { initial: 600, increment: 10 },
      icon: '⚙️',
    },
  ];

  const timeOptions = [
    { label: '1+0', value: { initial: 60, increment: 0 } },
    { label: '3+0', value: { initial: 180, increment: 0 } },
    { label: '5+3', value: { initial: 300, increment: 3 } },
    { label: '10+5', value: { initial: 600, increment: 5 } },
    { label: '15+10', value: { initial: 900, increment: 10 } },
    { label: '30+0', value: { initial: 1800, increment: 0 } },
  ];

  const handleModeSelect = (mode: GameMode) => {
    soundManager.play('button');
    setSelectedMode(mode.id);
    if (mode.id !== 'custom') {
      setTimeControl(mode.timeControl);
    }
  };

  const handleStartGame = () => {
    soundManager.play('button');
    
    // Create a mock game room for now
    const mockRoom = {
      id: 'room-' + Date.now(),
      name: 'Quick Match',
      players: {
        white: null,
        black: null,
      },
      spectators: [],
      gameState: {
        board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        turn: 'w' as const,
        gameStatus: 'waiting' as const,
        winner: null,
        lastMove: null,
        capturedPieces: { white: [], black: [] },
        moveHistory: [],
        timeLeft: { white: timeControl.initial, black: timeControl.initial },
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
      },
      timeControl,
      isPrivate: false,
      createdAt: new Date(),
    };

    setCurrentRoom(mockRoom);
    navigate('/game');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Choose Game Mode
          </h1>
          <p className="text-xl text-gray-300">
            Select your preferred time control and start playing
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Game Modes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Time Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameModes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                    selectedMode === mode.id
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => handleModeSelect(mode)}
                >
                  {mode.isPopular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{mode.description}</p>
                  <div className="text-yellow-400 font-mono text-lg">
                    {formatTime(mode.timeControl.initial)}+{mode.timeControl.increment}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Custom Time Control */}
          {selectedMode === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">Custom Time Control</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {timeOptions.map((option) => (
                  <motion.button
                    key={option.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      timeControl.initial === option.value.initial && timeControl.increment === option.value.increment
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                        : 'border-white/20 text-white hover:border-white/40'
                    }`}
                    onClick={() => setTimeControl(option.value)}
                  >
                    <div className="font-mono text-lg">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Color Preference */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">Color Preference</h3>
            <div className="flex gap-4">
              {[
                { value: 'white', label: 'White', icon: '♔' },
                { value: 'black', label: 'Black', icon: '♚' },
                { value: 'random', label: 'Random', icon: '🎲' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                    colorPreference === option.value
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                      : 'border-white/20 text-white hover:border-white/40'
                  }`}
                  onClick={() => setColorPreference(option.value as any)}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              disabled={!selectedMode}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-full text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Game
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-full text-xl hover:bg-white hover:text-black transition-all duration-300"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
