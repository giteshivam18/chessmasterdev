import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types';

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  soundEnabled: true,
  soundVolume: 0.7,
  boardTheme: 'classic',
  pieceStyle: 'classic',
  showLegalMoves: true,
  showCoordinates: true,
  animationSpeed: 'normal',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'chess-settings',
    }
  )
);
