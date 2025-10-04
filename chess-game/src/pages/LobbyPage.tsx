import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Crown,
  Zap,
  Target,
  Settings
} from 'lucide-react';
import GameModeSelector from '../components/game/GameModeSelector';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateGame, setShowCreateGame] = useState(false);

  // Mock games data
  const games = [
    {
      id: '1',
      whitePlayer: 'Player1',
      blackPlayer: null,
      mode: 'Blitz',
      timeControl: '5+2',
      rated: true,
      spectators: 3,
      createdAt: Date.now() - 300000,
    },
    {
      id: '2',
      whitePlayer: 'Player2',
      blackPlayer: null,
      mode: 'Bullet',
      timeControl: '1+1',
      rated: false,
      spectators: 1,
      createdAt: Date.now() - 600000,
    },
    {
      id: '3',
      whitePlayer: 'Player3',
      blackPlayer: 'Player4',
      mode: 'Rapid',
      timeControl: '15+5',
      rated: true,
      spectators: 12,
      createdAt: Date.now() - 900000,
    },
  ];

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    setShowCreateGame(true);
  };

  const handleJoinGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleCreateGame = () => {
    // TODO: Implement create game logic
    const newGameId = Math.random().toString(36).substr(2, 9);
    navigate(`/game/${newGameId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Game Lobby
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              onClick={() => setShowCreateGame(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Game
            </Button>
            <Button
              variant="ghost"
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Mode Selection */}
          <div className="lg:col-span-2">
            <GameModeSelector
              onModeSelect={handleModeSelect}
              selectedMode={selectedMode}
            />
          </div>

          {/* Active Games */}
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Games
                </h3>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Filter className="w-4 h-4" />}
                    fullWidth
                  >
                    Filter
                  </Button>
                </div>
              </div>
            </Card>

            {/* Games List */}
            <div className="space-y-3">
              {games.map((game) => (
                <Card
                  key={game.id}
                  hover
                  className="cursor-pointer"
                  onClick={() => handleJoinGame(game.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {game.whitePlayer}
                        </span>
                        {game.blackPlayer && (
                          <>
                            <span className="text-gray-400">vs</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {game.blackPlayer}
                            </span>
                          </>
                        )}
                        {!game.blackPlayer && (
                          <span className="text-sm text-green-600 dark:text-green-400">
                            Waiting for opponent
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          {game.mode === 'Blitz' && <Zap className="w-3 h-3" />}
                          {game.mode === 'Bullet' && <Target className="w-3 h-3" />}
                          {game.mode === 'Rapid' && <Clock className="w-3 h-3" />}
                          {game.mode === 'Classical' && <Crown className="w-3 h-3" />}
                          <span>{game.mode}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{game.timeControl}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{game.spectators}</span>
                        </div>
                        
                        {game.rated && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                            Rated
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinGame(game.id);
                      }}
                    >
                      {game.blackPlayer ? 'Spectate' : 'Join'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Game Modal */}
      {showCreateGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Game
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Game Mode
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="blitz">Blitz (5+2)</option>
                    <option value="bullet">Bullet (1+1)</option>
                    <option value="rapid">Rapid (15+5)</option>
                    <option value="classical">Classical (Unlimited)</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rated"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="rated" className="text-sm text-gray-700 dark:text-gray-300">
                    Rated game
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="private" className="text-sm text-gray-700 dark:text-gray-300">
                    Private game
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={handleCreateGame}
                  fullWidth
                >
                  Create Game
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateGame(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;