const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Chess } = require('chess.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state management
const games = new Map();
const players = new Map();

// Game room class
class GameRoom {
  constructor(id, timeControl = { minutes: 10, increment: 0 }) {
    this.id = id;
    this.chess = new Chess();
    this.players = { white: null, black: null };
    this.spectators = new Set();
    this.timeControl = timeControl;
    this.timers = { white: timeControl.minutes * 60, black: timeControl.minutes * 60 };
    this.lastMoveTime = Date.now();
    this.gameStatus = 'waiting'; // waiting, playing, finished
    this.winner = null;
    this.reason = null; // checkmate, timeout, resignation, draw
  }

  addPlayer(socketId, playerName, preferredColor = null) {
    if (this.players.white && this.players.black) {
      return { success: false, message: 'Room is full' };
    }

    const color = preferredColor || (this.players.white ? 'black' : 'white');
    if (this.players[color]) {
      return { success: false, message: `${color} is already taken` };
    }

    this.players[color] = { socketId, name: playerName };
    
    if (this.players.white && this.players.black) {
      this.gameStatus = 'playing';
      this.lastMoveTime = Date.now();
    }

    return { success: true, color, gameStatus: this.gameStatus };
  }

  addSpectator(socketId) {
    this.spectators.add(socketId);
  }

  removePlayer(socketId) {
    for (const color of ['white', 'black']) {
      if (this.players[color] && this.players[color].socketId === socketId) {
        this.players[color] = null;
        this.gameStatus = 'waiting';
        return color;
      }
    }
    this.spectators.delete(socketId);
    return null;
  }

  makeMove(from, to, promotion = null) {
    try {
      const move = this.chess.move({ from, to, promotion });
      if (move) {
        // Update timer
        const currentTime = Date.now();
        const timeElapsed = (currentTime - this.lastMoveTime) / 1000;
        const currentPlayer = this.chess.turn() === 'w' ? 'black' : 'white';
        this.timers[currentPlayer] = Math.max(0, this.timers[currentPlayer] - timeElapsed);
        
        // Add increment
        if (this.timeControl.increment > 0) {
          this.timers[this.chess.turn()] += this.timeControl.increment;
        }
        
        this.lastMoveTime = currentTime;

        // Check for game end conditions
        this.checkGameEnd();

        return { success: true, move, gameStatus: this.gameStatus };
      }
      return { success: false, message: 'Invalid move' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  checkGameEnd() {
    if (this.chess.isCheckmate()) {
      this.gameStatus = 'finished';
      this.winner = this.chess.turn() === 'w' ? 'black' : 'white';
      this.reason = 'checkmate';
    } else if (this.chess.isDraw()) {
      this.gameStatus = 'finished';
      this.winner = null;
      this.reason = 'draw';
    } else if (this.chess.isStalemate()) {
      this.gameStatus = 'finished';
      this.winner = null;
      this.reason = 'stalemate';
    }
  }

  updateTimers() {
    if (this.gameStatus === 'playing') {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - this.lastMoveTime) / 1000;
      const currentPlayer = this.chess.turn() === 'w' ? 'white' : 'black';
      this.timers[currentPlayer] = Math.max(0, this.timers[currentPlayer] - timeElapsed);
      this.lastMoveTime = currentTime;

      // Check for timeout
      if (this.timers[currentPlayer] <= 0) {
        this.gameStatus = 'finished';
        this.winner = currentPlayer === 'white' ? 'black' : 'white';
        this.reason = 'timeout';
      }
    }
  }

  getGameState() {
    return {
      id: this.id,
      fen: this.chess.fen(),
      pgn: this.chess.pgn(),
      turn: this.chess.turn(),
      gameStatus: this.gameStatus,
      timers: { ...this.timers },
      players: { ...this.players },
      winner: this.winner,
      reason: this.reason,
      timeControl: this.timeControl
    };
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ playerName, timeControl }) => {
    const roomId = uuidv4();
    const room = new GameRoom(roomId, timeControl);
    games.set(roomId, room);
    
    const result = room.addPlayer(socket.id, playerName);
    if (result.success) {
      players.set(socket.id, { roomId, color: result.color });
      socket.join(roomId);
      socket.emit('room-created', { roomId, ...result });
    }
  });

  socket.on('join-room', ({ roomId, playerName, preferredColor }) => {
    const room = games.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const result = room.addPlayer(socket.id, playerName, preferredColor);
    if (result.success) {
      players.set(socket.id, { roomId, color: result.color });
      socket.join(roomId);
      socket.emit('room-joined', result);
      io.to(roomId).emit('game-state', room.getGameState());
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  socket.on('spectate-room', ({ roomId }) => {
    const room = games.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    room.addSpectator(socket.id);
    socket.join(roomId);
    socket.emit('spectating', { roomId });
    socket.emit('game-state', room.getGameState());
  });

  socket.on('make-move', ({ from, to, promotion }) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = games.get(player.roomId);
    if (!room || room.gameStatus !== 'playing') return;

    // Check if it's the player's turn
    const currentTurn = room.chess.turn();
    const playerColor = player.color === 'white' ? 'w' : 'b';
    if (currentTurn !== playerColor) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    const result = room.makeMove(from, to, promotion);
    if (result.success) {
      io.to(player.roomId).emit('move-made', {
        move: result.move,
        gameState: room.getGameState()
      });
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  socket.on('resign', () => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = games.get(player.roomId);
    if (!room || room.gameStatus !== 'playing') return;

    room.gameStatus = 'finished';
    room.winner = player.color === 'white' ? 'black' : 'white';
    room.reason = 'resignation';

    io.to(player.roomId).emit('game-ended', {
      winner: room.winner,
      reason: room.reason,
      gameState: room.getGameState()
    });
  });

  socket.on('offer-draw', () => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = games.get(player.roomId);
    if (!room || room.gameStatus !== 'playing') return;

    // Notify opponent about draw offer
    const opponentColor = player.color === 'white' ? 'black' : 'white';
    const opponent = room.players[opponentColor];
    if (opponent) {
      io.to(opponent.socketId).emit('draw-offered', { from: player.color });
    }
  });

  socket.on('respond-draw', ({ accept }) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = games.get(player.roomId);
    if (!room || room.gameStatus !== 'playing') return;

    if (accept) {
      room.gameStatus = 'finished';
      room.winner = null;
      room.reason = 'draw';
      io.to(player.roomId).emit('game-ended', {
        winner: room.winner,
        reason: room.reason,
        gameState: room.getGameState()
      });
    } else {
      io.to(player.roomId).emit('draw-declined', { from: player.color });
    }
  });

  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      const room = games.get(player.roomId);
      if (room) {
        const removedColor = room.removePlayer(socket.id);
        if (removedColor && room.gameStatus === 'playing') {
          // Opponent wins by disconnect
          room.gameStatus = 'finished';
          room.winner = removedColor === 'white' ? 'black' : 'white';
          room.reason = 'disconnect';
          io.to(player.roomId).emit('game-ended', {
            winner: room.winner,
            reason: room.reason,
            gameState: room.getGameState()
          });
        } else {
          io.to(player.roomId).emit('player-left', { color: removedColor });
        }
      }
      players.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Timer update every second
setInterval(() => {
  games.forEach((room) => {
    room.updateTimers();
    if (room.gameStatus === 'playing') {
      io.to(room.id).emit('timer-update', {
        timers: room.timers,
        gameState: room.getGameState()
      });
    }
  });
}, 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});