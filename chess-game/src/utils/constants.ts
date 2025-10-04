export const APP_NAME = 'Chess Game';
export const APP_VERSION = '1.0.0';

// Game modes
export const GAME_MODES = {
  classical: {
    name: 'Classical Chess',
    description: 'Standard rules, unlimited time',
    icon: 'Crown',
    color: 'gold',
    timeControl: { initial: 0, increment: 0 },
  },
  blitz: {
    name: 'Blitz',
    description: 'Fast-paced, 3-5 minutes',
    icon: 'Zap',
    color: 'orange',
    timeControl: { initial: 300000, increment: 2000 }, // 5 min + 2s
  },
  bullet: {
    name: 'Bullet',
    description: 'Lightning speed, 1 minute',
    icon: 'Target',
    color: 'red',
    timeControl: { initial: 60000, increment: 1000 }, // 1 min + 1s
  },
  rapid: {
    name: 'Rapid',
    description: 'Quick games, 10-15 minutes',
    icon: 'Clock',
    color: 'blue',
    timeControl: { initial: 900000, increment: 5000 }, // 15 min + 5s
  },
  chess960: {
    name: 'Chess960',
    description: 'Random starting position',
    icon: 'Shuffle',
    color: 'purple',
    timeControl: { initial: 600000, increment: 2000 },
  },
  threeCheck: {
    name: 'Three-Check',
    description: 'Check opponent 3 times to win',
    icon: 'AlertTriangle',
    color: 'green',
    timeControl: { initial: 600000, increment: 2000 },
  },
  kingOfTheHill: {
    name: 'King of the Hill',
    description: 'Move king to center',
    icon: 'Mountain',
    color: 'teal',
    timeControl: { initial: 600000, increment: 2000 },
  },
  crazyhouse: {
    name: 'Crazyhouse',
    description: 'Drop captured pieces back',
    icon: 'Sparkles',
    color: 'pink',
    timeControl: { initial: 600000, increment: 2000 },
  },
} as const;

// Board themes
export const BOARD_THEMES = {
  classic: {
    name: 'Classic',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
  },
  modern: {
    name: 'Modern',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
  },
  wood: {
    name: 'Wood',
    lightSquare: '#d8a959',
    darkSquare: '#925a2e',
  },
  marble: {
    name: 'Marble',
    lightSquare: '#e8dcc5',
    darkSquare: '#7c8fa5',
  },
} as const;

// Piece sets
export const PIECE_SETS = {
  classic: 'Classic',
  modern: 'Modern',
  neo: 'Neo',
} as const;

// Time controls (in milliseconds)
export const TIME_CONTROLS = {
  unlimited: { initial: 0, increment: 0 },
  '1+0': { initial: 60000, increment: 0 },
  '1+1': { initial: 60000, increment: 1000 },
  '2+1': { initial: 120000, increment: 1000 },
  '3+0': { initial: 180000, increment: 0 },
  '3+2': { initial: 180000, increment: 2000 },
  '5+0': { initial: 300000, increment: 0 },
  '5+3': { initial: 300000, increment: 3000 },
  '10+0': { initial: 600000, increment: 0 },
  '10+5': { initial: 600000, increment: 5000 },
  '15+10': { initial: 900000, increment: 10000 },
  '30+0': { initial: 1800000, increment: 0 },
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  slow: 500,
  normal: 300,
  fast: 150,
} as const;

// Sound effects
export const SOUND_EVENTS = {
  MOVE: 'move',
  CAPTURE: 'capture',
  CASTLE: 'castle',
  CHECK: 'check',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  DRAW: 'draw',
  TIMER_WARNING: 'timer-warning',
  BUTTON_CLICK: 'button-click',
} as const;

// Socket events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Game events
  GAME_JOIN: 'game:join',
  GAME_LEAVE: 'game:leave',
  GAME_MOVE: 'game:move',
  GAME_OFFER_DRAW: 'game:offer_draw',
  GAME_RESIGN: 'game:resign',
  GAME_END: 'game:end',
  
  // Lobby events
  LOBBY_JOIN: 'lobby:join',
  LOBBY_LEAVE: 'lobby:leave',
  LOBBY_GAMES: 'lobby:games',
  LOBBY_GAME_CREATED: 'lobby:game_created',
  LOBBY_GAME_UPDATED: 'lobby:game_updated',
  LOBBY_GAME_REMOVED: 'lobby:game_removed',
  
  // Chat events
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  
  // Spectator events
  SPECTATE_JOIN: 'spectate:join',
  SPECTATE_LEAVE: 'spectate:leave',
  SPECTATE_UPDATE: 'spectate:update',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  GAME: {
    CREATE: '/api/game/create',
    JOIN: '/api/game/join',
    LEAVE: '/api/game/leave',
    MOVE: '/api/game/move',
    RESIGN: '/api/game/resign',
    OFFER_DRAW: '/api/game/offer_draw',
  },
  USER: {
    PROFILE: '/api/user/profile',
    STATS: '/api/user/stats',
    LEADERBOARD: '/api/user/leaderboard',
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'chess_user',
  SETTINGS: 'chess_settings',
  GAME_STATE: 'chess_game_state',
  THEME: 'chess_theme',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_MOVE: 'Invalid move',
  GAME_NOT_FOUND: 'Game not found',
  NOT_YOUR_TURN: 'Not your turn',
  GAME_ENDED: 'Game has ended',
  CONNECTION_LOST: 'Connection lost',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USERNAME_TAKEN: 'Username already taken',
  EMAIL_TAKEN: 'Email already taken',
  NETWORK_ERROR: 'Network error',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  MOVE_MADE: 'Move made successfully',
  GAME_JOINED: 'Joined game successfully',
  GAME_LEFT: 'Left game successfully',
  DRAW_OFFERED: 'Draw offer sent',
  GAME_RESIGNED: 'Game resigned',
  SETTINGS_SAVED: 'Settings saved',
  PROFILE_UPDATED: 'Profile updated',
} as const;

// Rating categories
export const RATING_CATEGORIES = {
  BEGINNER: { min: 0, max: 1200, name: 'Beginner' },
  NOVICE: { min: 1200, max: 1400, name: 'Novice' },
  INTERMEDIATE: { min: 1400, max: 1600, name: 'Intermediate' },
  ADVANCED: { min: 1600, max: 1800, name: 'Advanced' },
  EXPERT: { min: 1800, max: 2000, name: 'Expert' },
  MASTER: { min: 2000, max: 2200, name: 'Master' },
  GRANDMASTER: { min: 2200, max: Infinity, name: 'Grandmaster' },
} as const;