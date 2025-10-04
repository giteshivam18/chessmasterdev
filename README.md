# Chess Multiplayer Backend

A comprehensive Node.js/TypeScript backend for multiplayer chess with real-time gameplay, multiple game modes, ELO rating system, and matchmaking.

## Features

### Chess Engine
- **Complete chess rules implementation**
  - All standard piece movements (Pawn, Knight, Bishop, Rook, Queen, King)
  - Special moves: Castling (kingside/queenside), En passant, Pawn promotion
  - Game state detection: Check, Checkmate, Stalemate
  - Draw conditions: 50-move rule, Threefold repetition, Insufficient material
- **FEN notation support** for board state representation

### Game Modes
- **Classical Chess** - Standard rules
- **Blitz** - 3-5 minutes per player
- **Rapid** - 10-15 minutes per player
- **Bullet** - 1 minute per player
- **Chess960** - Fischer Random Chess with randomized starting positions
- **Three-check** - Win by checking opponent 3 times
- **King of the Hill** - Move king to center squares to win
- **Crazyhouse** - Captured pieces can be dropped back

### Timer System
- **Multiple formats**:
  - Fischer increment (adds time per move)
  - Bronstein delay (adds time up to delay amount)
  - Simple countdown
- Server-side validation prevents cheating
- Automatic loss on timeout

### Multiplayer Features
- Real-time game synchronization via Socket.io
- Matchmaking system with rating-based pairing
- Friend invites
- Spectator mode
- ELO rating system with automatic updates

## Installation

```bash
npm install
```

## Scripts

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Games
- `POST /api/games/create` - Create new game
- `POST /api/games/join/:gameId` - Join game
- `GET /api/games/active` - Get active games
- `GET /api/games/history?userId=:userId` - Get user game history
- `GET /api/games/:gameId` - Get game details

### Leaderboard
- `GET /api/leaderboard` - Get top players

## WebSocket Events

### Client -> Server
- `game:join` - Join a game room
- `game:move` - Make a move
- `game:resign` - Resign from game
- `game:draw-offer` - Offer draw
- `game:draw-accept` - Accept draw offer
- `matchmaking:join` - Join matchmaking queue
- `matchmaking:leave` - Leave matchmaking queue
- `spectator:join` - Join as spectator
- `spectator:leave` - Leave spectator mode

### Server -> Client
- `game:start` - Game has started
- `game:move` - Move was made
- `game:end` - Game ended
- `timer:update` - Timer update
- `matchmaking:found` - Match found
- `matchmaking:queued` - Added to queue
- `ratings:updated` - ELO ratings updated
- `error` - Error occurred

## Architecture

```
src/
├── chess/
│   ├── board.ts       # Chess board representation & FEN
│   ├── moves.ts       # Move generation & validation
│   └── engine.ts      # Chess engine logic
├── game/
│   ├── gameManager.ts # Game lifecycle management
│   └── matchmaking.ts # Matchmaking service
├── api/
│   ├── auth.ts        # Authentication endpoints
│   ├── games.ts       # Game endpoints
│   └── leaderboard.ts # Leaderboard endpoints
├── socket/
│   └── handlers.ts    # WebSocket event handlers
├── utils/
│   ├── elo.ts         # ELO rating calculator
│   └── storage.ts     # In-memory data storage
├── types/
│   └── index.ts       # TypeScript type definitions
└── index.ts           # Server entry point
```

## Data Models

### User
```typescript
{
  id: string
  username: string
  email: string
  rating: number
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  gamesDrawn: number
}
```

### Game
```typescript
{
  id: string
  whitePlayer: Player
  blackPlayer: Player
  mode: GameMode
  timeControl: TimeControl
  fen: string
  status: 'waiting' | 'active' | 'completed'
  winnerId?: string
  result?: GameResult
  whiteTime: number
  blackTime: number
  moves: Move[]
}
```

## Usage Examples

### Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player1@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player1@example.com","password":"pass123"}'
```

### WebSocket Connection
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Join matchmaking
socket.emit('matchmaking:join', {
  userId: 'user123',
  mode: 'blitz',
  timeControl: { initial: 180000, increment: 2000, format: 'fischer' }
});

// Listen for match
socket.on('matchmaking:found', ({ game }) => {
  console.log('Match found!', game);
});

// Make a move
socket.emit('game:move', {
  gameId: 'game123',
  userId: 'user123',
  from: 'e2',
  to: 'e4'
});
```

## Tech Stack

- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Express** - HTTP server
- **Socket.io** - Real-time communication
- **In-memory storage** - Fast data access

## License

ISC