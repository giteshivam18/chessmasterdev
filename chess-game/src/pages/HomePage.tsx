import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Play, 
  Users, 
  Trophy, 
  Settings, 
  Crown,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useUserStore } from '../stores/userStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  const quickPlayModes = [
    {
      name: 'Blitz',
      description: '5 min + 2s',
      icon: Zap,
      color: 'from-orange-400 to-orange-600',
      players: 1247,
    },
    {
      name: 'Bullet',
      description: '1 min + 1s',
      icon: Target,
      color: 'from-red-400 to-red-600',
      players: 892,
    },
    {
      name: 'Rapid',
      description: '15 min + 5s',
      icon: Clock,
      color: 'from-blue-400 to-blue-600',
      players: 634,
    },
    {
      name: 'Classical',
      description: 'Unlimited',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      players: 423,
    },
  ];

  const features = [
    {
      title: 'Play Online',
      description: 'Challenge players from around the world',
      icon: Users,
    },
    {
      title: 'Tournaments',
      description: 'Compete in ranked tournaments',
      icon: Trophy,
    },
    {
      title: 'Analysis',
      description: 'Analyze your games with AI',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Play Chess Online
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Challenge players worldwide, improve your skills, and enjoy the timeless game of chess
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/lobby')}
                leftIcon={<Play className="w-5 h-5" />}
              >
                Play Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/leaderboard')}
                leftIcon={<Trophy className="w-5 h-5" />}
              >
                View Leaderboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Play Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Play
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Jump into a game instantly with these popular time controls
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickPlayModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    hover
                    className="cursor-pointer group"
                    onClick={() => navigate('/lobby', { state: { mode: mode.name.toLowerCase() } })}
                  >
                    <div className="text-center space-y-4">
                      <div
                        className={clsx(
                          'w-16 h-16 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-200',
                          mode.color
                        )}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {mode.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {mode.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{mode.players} playing</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Experience chess like never before with our modern features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ready to Play?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of players and start your chess journey today
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/lobby')}
                leftIcon={<Play className="w-5 h-5" />}
              >
                Start Playing
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/auth/register')}
                >
                  Create Account
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;