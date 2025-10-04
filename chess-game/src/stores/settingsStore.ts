import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserPreferences } from '../types/user.types';

interface SettingsStore extends UserPreferences {
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setBoardTheme: (theme: 'classic' | 'modern' | 'wood' | 'marble') => void;
  setPieceSet: (set: 'classic' | 'modern' | 'neo') => void;
  setSoundVolume: (volume: number) => void;
  toggleSound: () => void;
  toggleLegalMoves: () => void;
  toggleCoordinates: () => void;
  toggleAutoQueen: () => void;
  toggleConfirmMoves: () => void;
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  updateSettings: (settings: Partial<UserPreferences>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: UserPreferences = {
  theme: 'light',
  boardTheme: 'classic',
  pieceSet: 'classic',
  soundEnabled: true,
  soundVolume: 0.7,
  showLegalMoves: true,
  showCoordinates: true,
  autoQueen: true,
  confirmMoves: false,
  animationSpeed: 'normal',
  language: 'en',
  timezone: 'UTC',
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme: 'light' | 'dark') => set(() => ({
        theme,
      })),

      setBoardTheme: (boardTheme: 'classic' | 'modern' | 'wood' | 'marble') => set(() => ({
        boardTheme,
      })),

      setPieceSet: (pieceSet: 'classic' | 'modern' | 'neo') => set(() => ({
        pieceSet,
      })),

      setSoundVolume: (soundVolume: number) => set(() => ({
        soundVolume: Math.max(0, Math.min(1, soundVolume)),
      })),

      toggleSound: () => set((state) => ({
        soundEnabled: !state.soundEnabled,
      })),

      toggleLegalMoves: () => set((state) => ({
        showLegalMoves: !state.showLegalMoves,
      })),

      toggleCoordinates: () => set((state) => ({
        showCoordinates: !state.showCoordinates,
      })),

      toggleAutoQueen: () => set((state) => ({
        autoQueen: !state.autoQueen,
      })),

      toggleConfirmMoves: () => set((state) => ({
        confirmMoves: !state.confirmMoves,
      })),

      setAnimationSpeed: (animationSpeed: 'slow' | 'normal' | 'fast') => set(() => ({
        animationSpeed,
      })),

      setLanguage: (language: string) => set(() => ({
        language,
      })),

      setTimezone: (timezone: string) => set(() => ({
        timezone,
      })),

      updateSettings: (settings: Partial<UserPreferences>) => set((state) => ({
        ...state,
        ...settings,
      })),

      resetToDefaults: () => set(() => ({
        ...defaultSettings,
      })),
    }),
    {
      name: 'settings-store',
    }
  )
);