import React, { useState } from 'react';
import { 
  User, 
  Trophy, 
  BarChart3, 
  Edit3,
  Save,
  X
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUserStore } from '../stores/userStore';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    country: user?.country || '',
  });

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      username: user?.username || '',
      country: user?.country || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h2>
          <Button variant="primary">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              leftIcon={isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center space-y-4">
                {/* Avatar */}
                <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* User Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.username}
                  </h2>
                  {user.title && (
                    <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-bold rounded-full mt-2">
                      {user.title}
                    </span>
                  )}
                  {user.country && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {user.country}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Games Played
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.gamesWon}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Games Won
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Stats
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Win Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {((user.gamesWon / user.gamesPlayed) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Draw Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {((user.gamesDrawn / user.gamesPlayed) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(user.joinDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ratings */}
            <Card>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ratings
                  </h3>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.rating.classical}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Classical
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.rating.blitz}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Blitz
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.rating.bullet}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Bullet
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.rating.rapid}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rapid
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Edit Profile Form */}
            {isEditing && (
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Profile
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Username"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    />
                    
                    <Input
                      label="Country"
                      value={editData.country}
                      onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Games */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Games
                  </h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No recent games to display
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;