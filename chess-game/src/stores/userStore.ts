import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, UserPreferences, AuthState, LoginCredentials, RegisterCredentials } from '../types/user.types';

interface UserStore extends AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const defaultPreferences: UserPreferences = {
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

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement actual API call
          const mockUser: User = {
            id: '1',
            username: credentials.email.split('@')[0],
            email: credentials.email,
            rating: {
              classical: 1200,
              blitz: 1100,
              bullet: 1000,
              rapid: 1150,
            },
            isOnline: true,
            lastSeen: Date.now(),
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            gamesDrawn: 0,
            joinDate: Date.now(),
            preferences: defaultPreferences,
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement actual API call
          const mockUser: User = {
            id: '1',
            username: credentials.username,
            email: credentials.email,
            rating: {
              classical: 1200,
              blitz: 1100,
              bullet: 1000,
              rapid: 1150,
            },
            isOnline: true,
            lastSeen: Date.now(),
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            gamesDrawn: 0,
            joinDate: Date.now(),
            preferences: defaultPreferences,
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
        }
      },

      logout: () => set(() => ({
        user: null,
        isAuthenticated: false,
        error: null,
      })),

      updateProfile: (updates: Partial<User>) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),

      updatePreferences: (preferences: Partial<UserPreferences>) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        } : null,
      })),

      setUser: (user: User | null) => set(() => ({
        user,
        isAuthenticated: !!user,
      })),

      setLoading: (loading: boolean) => set(() => ({
        isLoading: loading,
      })),

      setError: (error: string | null) => set(() => ({
        error,
      })),

      clearError: () => set(() => ({
        error: null,
      })),
    }),
    {
      name: 'user-store',
    }
  )
);