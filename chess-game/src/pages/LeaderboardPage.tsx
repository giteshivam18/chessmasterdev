import React, { useState } from 'react';
import { clsx } from 'clsx';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Users,
  Filter,
  Search
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LeaderboardPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('blitz');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      username: 'ChessMaster2024',
      rating: 2456,
      title: 'GM',
      country: 'US',
      gamesPlayed: 1247,
      winRate: 78.5,
      avatar: null,
    },
    {
      rank: 2,
      username: 'TacticalGenius',
      rating: 2389,
      title: 'IM',
      country: 'RU',
      gamesPlayed: 892,
      winRate: 82.1,
      avatar: null,
    },
    {
      rank: 3,
      username: 'EndgameExpert',
      rating: 2345,
      title: 'FM',
      country: 'DE',
      gamesPlayed: 1563,
      winRate: 75.3,
      avatar: null,
    },
    {
      rank: 4,
      username: 'OpeningMaster',
      rating: 2312,
      title: 'CM',
      country: 'IN',
      gamesPlayed: 987,
      winRate: 79.8,
      avatar: null,
    },
    {
      rank: 5,
      username: 'PositionalPlayer',
      rating: 2287,
      title: null,
      country: 'FR',
      gamesPlayed: 743,
      winRate: 76.2,
      avatar: null,
    },
  ];

  const categories = [
    { key: 'blitz', name: 'Blitz', icon: TrendingUp },
    { key: 'bullet', name: 'Bullet', icon: TrendingUp },
    { key: 'rapid', name: 'Rapid', icon: TrendingUp },
    { key: 'classical', name: 'Classical', icon: Crown },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
          {rank}
        </span>;
    }
  };

  const getTitleColor = (title: string | null) => {
    switch (title) {
      case 'GM':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'IM':
        return 'text-gray-600 dark:text-gray-400';
      case 'FM':
        return 'text-amber-600 dark:text-amber-400';
      case 'CM':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-500 dark:text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Top players from around the world
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>12,847 active players</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Categories
                </h3>
                
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.key}
                        onClick={() => setSelectedCategory(category.key)}
                        className={clsx(
                          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                          selectedCategory === category.key
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Search */}
            <Card className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Players
                </h3>
                
                <Input
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {categories.find(c => c.key === selectedCategory)?.name} Rankings
                  </h2>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Filter className="w-4 h-4" />}
                  >
                    Filter
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Rank
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Player
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Rating
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Games
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Win Rate
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Country
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((player) => (
                        <tr
                          key={player.rank}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getRankIcon(player.rank)}
                            </div>
                          </td>
                          
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {player.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {player.username}
                                  </span>
                                  {player.title && (
                                    <span className={clsx(
                                      'text-xs font-bold px-2 py-1 rounded',
                                      getTitleColor(player.title)
                                    )}>
                                      {player.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="py-4 px-4">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {player.rating}
                            </span>
                          </td>
                          
                          <td className="py-4 px-4">
                            <span className="text-gray-600 dark:text-gray-400">
                              {player.gamesPlayed.toLocaleString()}
                            </span>
                          </td>
                          
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-primary-500 h-2 rounded-full"
                                  style={{ width: `${player.winRate}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {player.winRate}%
                              </span>
                            </div>
                          </td>
                          
                          <td className="py-4 px-4">
                            <span className="text-gray-600 dark:text-gray-400">
                              {player.country}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing 1-5 of 12,847 players
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;