import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { soundManager } from '../utils/soundManager';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const gameModes = [
    {
      id: 'quick-match',
      name: 'Quick Match',
      description: 'Play against a random opponent',
      icon: '⚡',
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 'create-room',
      name: 'Create Room',
      description: 'Create a private game room',
      icon: '🏠',
      color: 'from-green-500 to-teal-600',
    },
    {
      id: 'join-room',
      name: 'Join Room',
      description: 'Join with a room code',
      icon: '🔗',
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'computer',
      name: 'vs Computer',
      description: 'Practice against AI',
      icon: '🤖',
      color: 'from-gray-500 to-gray-700',
    },
  ];

  const handlePlayClick = () => {
    soundManager.play('button');
    navigate('/game-selection');
  };

  const handleAuthClick = () => {
    soundManager.play('button');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Chess Pieces Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-10"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
            >
              {['♔', '♕', '♖', '♗', '♘', '♙'][i]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              Chess
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Master
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Play chess online with friends, challenge the computer, or join tournaments. 
              Experience the ultimate chess platform with real-time gameplay.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayClick}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-full text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
              >
                Play Now
              </motion.button>
              
              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAuthClick}
                  className="border-2 border-white text-white font-bold py-4 px-8 rounded-full text-xl hover:bg-white hover:text-black transition-all duration-300"
                >
                  Login / Register
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Game Modes Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Game Mode
          </h2>
          <p className="text-xl text-gray-300">
            Multiple ways to enjoy chess
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
              onClick={() => {
                soundManager.play('button');
                navigate(`/game-selection?mode=${mode.id}`);
              }}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center text-3xl mb-4 mx-auto`}>
                {mode.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
              <p className="text-gray-300 text-sm">{mode.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/20 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Chess Master?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Real-time Play',
                description: 'Play with friends in real-time with instant moves and live updates',
              },
              {
                icon: '🎵',
                title: 'Sound Effects',
                description: 'Immersive audio experience with move sounds and game effects',
              },
              {
                icon: '📱',
                title: 'Responsive Design',
                description: 'Play on any device - desktop, tablet, or mobile',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Chess Master. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
