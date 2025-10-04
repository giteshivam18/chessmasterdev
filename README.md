# Real-Time Multiplayer Chess Game

A modern, real-time multiplayer chess game built with React, TypeScript, Socket.io, and Express. Features include drag-and-drop piece movement, real-time synchronization, timer controls, and a beautiful responsive UI.

## Features

### Core Game Features
- ✅ Complete chess rules implementation (castling, en passant, promotion, check/checkmate)
- ✅ Real-time multiplayer with Socket.io
- ✅ Drag-and-drop piece movement
- ✅ Legal move validation and highlighting
- ✅ Multiple time controls with visual timers
- ✅ Game room creation and joining
- ✅ Spectator mode

### UI/UX Features
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Dark/Light theme support
- ✅ Mobile-friendly touch controls
- ✅ Visual feedback for moves, checks, and game states
- ✅ Move history and captured pieces display

### Technical Features
- ✅ TypeScript for type safety
- ✅ Zustand for state management
- ✅ Chess.js for game logic
- ✅ Real-time synchronization
- ✅ Error handling and reconnection
- ✅ Security validation (server-side move validation)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **Game Logic**: Chess.js
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd real-time-chess-game
   npm run install-all
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

3. **Open your browser:**
   Navigate to `http://localhost:3000` to start playing!

### Manual Setup

If you prefer to set up each part manually:

1. **Backend Setup:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm start
   ```

## Game Modes

### Quick Match
- Get matched with a random opponent instantly
- Various time controls available
- Automatic color assignment

### Create Room
- Create a private room with custom settings
- Share room ID with friends
- Choose your preferred color

### Join Room
- Join an existing room with a room ID
- Select your preferred color
- Spectate ongoing games

### Spectate
- Watch ongoing games without playing
- View move history and game state
- No time restrictions

## Time Controls

- **1+0**: 1 minute per player
- **3+0**: 3 minutes per player
- **5+0**: 5 minutes per player
- **10+0**: 10 minutes per player
- **15+10**: 15 minutes + 10 seconds increment
- **30+0**: 30 minutes per player

## Game Features

### Move Validation
- All moves are validated server-side for security
- Visual indicators for legal moves
- Invalid move feedback

### Timer System
- Visual countdown timers
- Low-time warnings
- Automatic timeout detection

### Game States
- Check/Checkmate detection
- Stalemate detection
- Draw by agreement
- Resignation handling

### UI Features
- Drag-and-drop piece movement
- Legal move highlighting
- Last move indication
- Check/checkmate visual feedback
- Responsive design for all devices

## Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
├── server/                # Express backend
│   ├── index.js          # Main server file
│   └── package.json
└── package.json          # Root package.json
```

### Available Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run client`: Start only the frontend
- `npm run server`: Start only the backend
- `npm run build`: Build the frontend for production
- `npm run install-all`: Install dependencies for all packages

### Environment Variables

**Client (.env):**
```
REACT_APP_SERVER_URL=http://localhost:5000
```

**Server (.env):**
```
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `client/build` folder
3. Update `REACT_APP_SERVER_URL` to your backend URL

### Backend (Heroku/Railway/DigitalOcean)
1. Deploy the `server` folder
2. Set environment variables
3. Update CORS settings for your frontend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Future Enhancements

- [ ] Sound effects with Howler.js
- [ ] Game analysis and review mode
- [ ] Tournament system
- [ ] User accounts and statistics
- [ ] Custom board themes
- [ ] Mobile app (React Native)
- [ ] AI opponent integration
- [ ] Chat system
- [ ] Replay functionality

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Socket.io