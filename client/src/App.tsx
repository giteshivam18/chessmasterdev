import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { useSocket } from './hooks/useSocket';
import LandingPage from './components/LandingPage';
import GameSelection from './components/GameSelection';
import GameInterface from './components/GameInterface';
import './App.css';

type AppState = 'landing' | 'game-selection' | 'game' | 'spectate';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppState>('landing');
  const { playerName, setPlayerName, resetGame } = useGameStore();
  const { isConnected } = useSocket();

  const handleStartGame = () => {
    if (playerName.trim()) {
      setCurrentView('game-selection');
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim()) {
      setCurrentView('game');
    }
  };

  const handleSpectate = () => {
    setCurrentView('spectate');
  };

  const handleBackToLanding = () => {
    resetGame();
    setCurrentView('landing');
  };

  const handleGameStart = () => {
    setCurrentView('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === 'landing' && (
          <LandingPage
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onStartGame={handleStartGame}
            onJoinGame={handleJoinGame}
            onSpectate={handleSpectate}
          />
        )}

        {currentView === 'game-selection' && (
          <GameSelection
            onBack={handleBackToLanding}
            onGameStart={handleGameStart}
          />
        )}

        {currentView === 'game' && (
          <GameInterface
            onBack={handleBackToLanding}
          />
        )}

        {currentView === 'spectate' && (
          <GameInterface
            isSpectating={true}
            onBack={handleBackToLanding}
          />
        )}
      </div>
    </div>
  );
};

export default App;