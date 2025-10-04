import React from 'react';
import { clsx } from 'clsx';
import { useTimer } from '../../hooks/useTimer';

export interface TimerDisplayProps {
  timeRemaining: number;
  isActive: boolean;
  increment: number;
  playerName: string;
  playerAvatar?: string;
  moveCount: number;
  className?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  isActive,
  increment,
  playerName,
  playerAvatar,
  moveCount,
  className,
}) => {
  const { formatTime } = useTimer();
  const formattedTime = formatTime(timeRemaining);
  const isLowTime = timeRemaining < 30000; // Less than 30 seconds
  const isCriticalTime = timeRemaining < 10000; // Less than 10 seconds

  // Calculate progress percentage (assuming 10 minutes = 100%)
  const maxTime = 600000; // 10 minutes in milliseconds
  const progressPercentage = Math.max(0, (timeRemaining / maxTime) * 100);

  return (
    <div
      className={clsx(
        'flex items-center justify-between p-4 rounded-lg transition-all duration-300',
        isActive && 'ring-2 ring-primary-500 ring-opacity-50',
        isLowTime && 'bg-yellow-50 dark:bg-yellow-900/20',
        isCriticalTime && 'bg-red-50 dark:bg-red-900/20 animate-timer-pulse',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Player Info */}
      <div className="flex items-center space-x-3">
        {playerAvatar && (
          <img
            src={playerAvatar}
            alt={playerName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {playerName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {moveCount} moves
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="text-right">
        <div
          className={clsx(
            'text-2xl font-mono font-bold transition-colors duration-200',
            isCriticalTime
              ? 'text-red-600 dark:text-red-400'
              : isLowTime
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-900 dark:text-white'
          )}
        >
          {formattedTime}
        </div>
        
        {increment > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{increment / 1000}s
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
        <div
          className={clsx(
            'h-full transition-all duration-300',
            isCriticalTime
              ? 'bg-red-500'
              : isLowTime
              ? 'bg-yellow-500'
              : 'bg-primary-500'
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;