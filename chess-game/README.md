# Chess Game Frontend

A modern, responsive chess game built with React, TypeScript, and Tailwind CSS.

## Features

### 🎮 Game Modes
- **Classical Chess** - Standard rules with unlimited time
- **Blitz** - Fast-paced 3-5 minute games
- **Bullet** - Lightning speed 1 minute games
- **Rapid** - Quick 10-15 minute games
- **Chess960** - Random starting positions
- **Three-Check** - Check opponent 3 times to win
- **King of the Hill** - Move king to center squares
- **Crazyhouse** - Drop captured pieces back

### 🎨 Visual Features
- **Multiple Board Themes** - Classic, Modern, Wood, Marble
- **Piece Sets** - Classic, Modern, Neo styles
- **Dark/Light Mode** - Automatic theme switching
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion powered
- **Legal Move Highlights** - Visual move indicators
- **Drag & Drop** - Intuitive piece movement

### 🔊 Audio Features
- **Sound Effects** - Move, capture, check, victory sounds
- **Volume Control** - Adjustable audio levels
- **Mute Toggle** - Quick sound on/off
- **Timer Warnings** - Audio alerts for low time

### ⚡ Performance
- **Real-time Updates** - WebSocket connections
- **State Management** - Zustand stores
- **Optimized Rendering** - React.memo and useMemo
- **Lazy Loading** - Code splitting for better performance

### 🏆 Competitive Features
- **Online Multiplayer** - Play against real opponents
- **Rating System** - ELO-based rankings
- **Leaderboards** - Global player rankings
- **Tournaments** - Competitive events
- **Spectator Mode** - Watch ongoing games

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Socket.io** - Real-time communication
- **Chess.js** - Chess logic
- **Howler.js** - Audio management
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chess-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── chess/          # Chess-specific components
│   ├── game/           # Game-related components
│   ├── layout/         # Layout components
│   ├── ui/             # Reusable UI components
│   └── auth/           # Authentication components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── services/           # API and service functions
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── assets/             # Static assets
└── styles/             # CSS files
```

## Key Components

### ChessBoard
The main chess board component with drag-and-drop functionality, legal move highlights, and visual feedback.

### TimerDisplay
Player timer with countdown, increment display, and low-time warnings.

### GameModeSelector
Beautiful grid of game mode cards with hover effects and mode information.

### MoveHistory
Scrollable move list with algebraic notation and move navigation.

### CapturedPieces
Display of captured pieces with material advantage calculation.

## State Management

The app uses Zustand for state management with three main stores:

- **gameStore** - Game state, moves, position
- **userStore** - User authentication and profile
- **settingsStore** - User preferences and settings

## Custom Hooks

- **useChessGame** - Chess logic and move validation
- **useSocket** - WebSocket connection management
- **useTimer** - Chess clock functionality
- **useSoundEffects** - Audio system management

## Styling

The project uses Tailwind CSS with custom configurations:

- Custom color palette for chess themes
- Board-specific color schemes
- Animation keyframes for chess interactions
- Responsive breakpoints for mobile/tablet/desktop

## Audio System

Sound effects are managed through Howler.js with:

- Preloaded audio files
- Volume control
- Mute functionality
- Sound event mapping

## Responsive Design

The app is fully responsive with breakpoints:

- **Mobile** (< 640px) - Full-screen board, bottom sheet UI
- **Tablet** (640px - 1024px) - Board 70%, sidebar 30%
- **Desktop** (> 1024px) - Board 65%, sidebar 35%

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Chess.js for chess logic
- Framer Motion for animations
- Tailwind CSS for styling
- Lucide for icons
- Howler.js for audio