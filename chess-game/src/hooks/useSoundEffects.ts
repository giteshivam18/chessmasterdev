import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';

interface UseSoundEffectsReturn {
  playMove: () => void;
  playCapture: () => void;
  playCastle: () => void;
  playCheck: () => void;
  playVictory: () => void;
  playDefeat: () => void;
  playDraw: () => void;
  playTimerWarning: () => void;
  stopTimerWarning: () => void;
  playButtonClick: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  volume: number;
}

// Sound file paths - these would be actual audio files in production
const SOUND_PATHS = {
  move: '/sounds/move.mp3',
  capture: '/sounds/capture.mp3',
  castle: '/sounds/castle.mp3',
  check: '/sounds/check.mp3',
  victory: '/sounds/victory.mp3',
  defeat: '/sounds/defeat.mp3',
  draw: '/sounds/draw.mp3',
  timerWarning: '/sounds/timer-warning.mp3',
  buttonClick: '/sounds/button-click.mp3',
};

export const useSoundEffects = (initialVolume: number = 0.7): UseSoundEffectsReturn => {
  const [volume, setVolumeState] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const soundsRef = useRef<Map<string, Howl>>(new Map());
  const timerWarningRef = useRef<Howl | null>(null);

  // Initialize sounds
  useEffect(() => {
    const sounds = new Map<string, Howl>();

    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      const howl = new Howl({
        src: [path],
        volume: volume,
        preload: true,
        onloaderror: () => {
          console.warn(`Failed to load sound: ${key}`);
        },
      });
      sounds.set(key, howl);
    });

    soundsRef.current = sounds;

    return () => {
      sounds.forEach(sound => sound.unload());
    };
  }, []);

  const playSound = useCallback((soundKey: string, options?: { volume?: number; loop?: boolean }) => {
    if (isMuted) return;

    const sound = soundsRef.current.get(soundKey);
    if (sound) {
      sound.volume(options?.volume || volume);
      sound.loop(options?.loop || false);
      sound.play();
    }
  }, [isMuted, volume]);

  const playMove = useCallback(() => {
    playSound('move');
  }, [playSound]);

  const playCapture = useCallback(() => {
    playSound('capture');
  }, [playSound]);

  const playCastle = useCallback(() => {
    playSound('castle');
  }, [playSound]);

  const playCheck = useCallback(() => {
    playSound('check');
  }, [playSound]);

  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  const playDefeat = useCallback(() => {
    playSound('defeat');
  }, [playSound]);

  const playDraw = useCallback(() => {
    playSound('draw');
  }, [playSound]);

  const playTimerWarning = useCallback(() => {
    if (timerWarningRef.current) {
      timerWarningRef.current.stop();
    }
    
    const sound = soundsRef.current.get('timerWarning');
    if (sound) {
      sound.loop(true);
      sound.volume(volume);
      sound.play();
      timerWarningRef.current = sound;
    }
  }, [playSound, volume]);

  const stopTimerWarning = useCallback(() => {
    if (timerWarningRef.current) {
      timerWarningRef.current.stop();
      timerWarningRef.current = null;
    }
  }, []);

  const playButtonClick = useCallback(() => {
    playSound('buttonClick', { volume: volume * 0.5 });
  }, [playSound, volume]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    // Update all sounds with new volume
    soundsRef.current.forEach(sound => {
      sound.volume(clampedVolume);
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    
    if (isMuted) {
      // Unmuting - restore volume
      soundsRef.current.forEach(sound => {
        sound.volume(volume);
      });
    } else {
      // Muting - set volume to 0
      soundsRef.current.forEach(sound => {
        sound.volume(0);
      });
    }
  }, [isMuted, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (!isMuted) {
      soundsRef.current.forEach(sound => {
        sound.volume(volume);
      });
    }
  }, [volume, isMuted]);

  return {
    playMove,
    playCapture,
    playCastle,
    playCheck,
    playVictory,
    playDefeat,
    playDraw,
    playTimerWarning,
    stopTimerWarning,
    playButtonClick,
    setVolume,
    toggleMute,
    isMuted,
    volume,
  };
};