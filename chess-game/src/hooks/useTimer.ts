import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  activePlayer: 'white' | 'black';
  start: () => void;
  pause: () => void;
  switchTurn: () => void;
  addIncrement: (player: 'white' | 'black') => void;
  reset: (initialTime: number) => void;
  formatTime: (time: number) => string;
}

export const useTimer = (initialTime: number = 600000): UseTimerReturn => {
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState<'white' | 'black'>('white');
  
  const intervalRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  const start = useCallback((_initialTime?: number) => {
    if (!isRunning) {
      setIsRunning(true);
      lastUpdateRef.current = Date.now();
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const switchTurn = useCallback(() => {
    setActivePlayer(prev => prev === 'white' ? 'black' : 'white');
  }, []);

  const addIncrement = useCallback((player: 'white' | 'black') => {
    if (player === 'white') {
      setWhiteTime(prev => prev + 2000); // 2 second increment
    } else {
      setBlackTime(prev => prev + 2000);
    }
  }, []);

  const reset = useCallback((newInitialTime: number) => {
    setWhiteTime(newInitialTime);
    setBlackTime(newInitialTime);
    setIsRunning(false);
    setActivePlayer('white');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const formatTime = useCallback((time: number): string => {
    const totalSeconds = Math.ceil(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const delta = now - lastUpdateRef.current;
        lastUpdateRef.current = now;

        if (activePlayer === 'white') {
          setWhiteTime(prev => {
            const newTime = prev - delta;
            return newTime <= 0 ? 0 : newTime;
          });
        } else {
          setBlackTime(prev => {
            const newTime = prev - delta;
            return newTime <= 0 ? 0 : newTime;
          });
        }
      }, 100); // Update every 100ms for smooth countdown
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activePlayer]);

  // Check for timeout
  useEffect(() => {
    if (whiteTime <= 0 && activePlayer === 'white') {
      pause();
      // Emit timeout event or call callback
    }
    if (blackTime <= 0 && activePlayer === 'black') {
      pause();
      // Emit timeout event or call callback
    }
  }, [whiteTime, blackTime, activePlayer, pause]);

  return {
    whiteTime,
    blackTime,
    isRunning,
    activePlayer,
    start,
    pause,
    switchTurn,
    addIncrement,
    reset,
    formatTime,
  };
};