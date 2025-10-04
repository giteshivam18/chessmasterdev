import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  Target, 
  Clock, 
  Shuffle, 
  AlertTriangle, 
  Mountain, 
  Sparkles,
  Users
} from 'lucide-react';
import { GAME_MODES } from '../../utils/constants';
import Card from '../ui/Card';

export interface GameModeSelectorProps {
  onModeSelect: (mode: string) => void;
  selectedMode?: string;
  className?: string;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  onModeSelect,
  selectedMode,
  className,
}) => {
  const modeIcons = {
    classical: Crown,
    blitz: Zap,
    bullet: Target,
    rapid: Clock,
    chess960: Shuffle,
    threeCheck: AlertTriangle,
    kingOfTheHill: Mountain,
    crazyhouse: Sparkles,
  };

  const modeColors = {
    classical: 'from-yellow-400 to-yellow-600',
    blitz: 'from-orange-400 to-orange-600',
    bullet: 'from-red-400 to-red-600',
    rapid: 'from-blue-400 to-blue-600',
    chess960: 'from-purple-400 to-purple-600',
    threeCheck: 'from-green-400 to-green-600',
    kingOfTheHill: 'from-teal-400 to-teal-600',
    crazyhouse: 'from-pink-400 to-pink-600',
  };

  return (
    <div className={clsx('space-y-6', className)}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Game Mode
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select your preferred chess variant and time control
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(GAME_MODES).map(([key, mode]) => {
          const Icon = modeIcons[key as keyof typeof modeIcons];
          const colorClass = modeColors[key as keyof typeof modeColors];
          const isSelected = selectedMode === key;

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeSelect(key)}
            >
              <Card
                hover
                className={clsx(
                  'cursor-pointer transition-all duration-200',
                  isSelected && 'ring-2 ring-primary-500 ring-opacity-50',
                  'relative overflow-hidden'
                )}
              >
                {/* Background Gradient */}
                <div
                  className={clsx(
                    'absolute inset-0 bg-gradient-to-br opacity-10',
                    colorClass
                  )}
                />
                
                {/* Content */}
                <div className="relative p-6 text-center space-y-4">
                  {/* Icon */}
                  <div
                    className={clsx(
                      'w-16 h-16 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center',
                      colorClass
                    )}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Mode Name */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {mode.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode.description}
                  </p>

                  {/* Time Control */}
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {mode.timeControl.initial === 0
                      ? 'Unlimited time'
                      : `${Math.floor(mode.timeControl.initial / 60000)} min + ${mode.timeControl.increment / 1000}s`
                    }
                  </div>

                  {/* Online Players */}
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{Math.floor(Math.random() * 50) + 10} online</span>
                  </div>

                  {/* Difficulty Rating */}
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={clsx(
                          'w-2 h-2 rounded-full',
                          star <= 3 ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      />
                    ))}
                  </div>

                  {/* New Badge */}
                  {key === 'crazyhouse' && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                        New
                      </span>
                    </div>
                  )}

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          All modes support both rated and casual games
        </p>
        <p>
          Click on a mode to start playing or create a custom game
        </p>
      </div>
    </div>
  );
};

export default GameModeSelector;