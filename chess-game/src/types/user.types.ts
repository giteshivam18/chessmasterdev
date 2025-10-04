export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  rating: {
    classical: number;
    blitz: number;
    bullet: number;
    rapid: number;
  };
  title?: 'GM' | 'IM' | 'FM' | 'CM' | 'WGM' | 'WIM' | 'WFM' | 'WCM';
  country?: string;
  isOnline: boolean;
  lastSeen: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  joinDate: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  boardTheme: 'classic' | 'modern' | 'wood' | 'marble';
  pieceSet: 'classic' | 'modern' | 'neo';
  soundEnabled: boolean;
  soundVolume: number;
  showLegalMoves: boolean;
  showCoordinates: boolean;
  autoQueen: boolean;
  confirmMoves: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  language: string;
  timezone: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdate {
  username?: string;
  avatar?: string;
  country?: string;
  preferences?: Partial<UserPreferences>;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  rating: number;
  gamesPlayed: number;
  winRate: number;
  streak: number;
}

export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  averageGameTime: number;
  favoriteMode: string;
  bestRating: number;
  ratingHistory: {
    date: number;
    rating: number;
    mode: string;
  }[];
}