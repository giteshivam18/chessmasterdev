import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/useGameStore';
import { GameState, Move } from '../types';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const {
    setConnectionStatus,
    updateGameState,
    addMove,
    setDrawOffer,
  } = useGameStore();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SERVER_URL, {
      autoConnect: true,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus(false);
    });

    // Game events
    socket.on('room-created', (data) => {
      console.log('Room created:', data);
      useGameStore.getState().setRoomId(data.roomId);
      useGameStore.getState().setPlayerColor(data.color);
    });

    socket.on('room-joined', (data) => {
      console.log('Joined room:', data);
      useGameStore.getState().setPlayerColor(data.color);
    });

    socket.on('spectating', (data) => {
      console.log('Spectating room:', data);
      useGameStore.getState().setRoomId(data.roomId);
    });

    socket.on('game-state', (gameState: GameState) => {
      console.log('Game state updated:', gameState);
      updateGameState(gameState);
    });

    socket.on('move-made', (data: { move: Move; gameState: GameState }) => {
      console.log('Move made:', data.move);
      addMove(data.move);
      updateGameState(data.gameState);
    });

    socket.on('timer-update', (data: { timers: any; gameState: GameState }) => {
      updateGameState(data.gameState);
    });

    socket.on('game-ended', (data: { winner: string | null; reason: string; gameState: GameState }) => {
      console.log('Game ended:', data);
      updateGameState(data.gameState);
    });

    socket.on('player-left', (data: { color: string }) => {
      console.log('Player left:', data.color);
    });

    socket.on('draw-offered', (data: { from: string }) => {
      console.log('Draw offered by:', data.from);
      setDrawOffer({ from: data.from, pending: true });
    });

    socket.on('draw-declined', (data: { from: string }) => {
      console.log('Draw declined by:', data.from);
      setDrawOffer(null);
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
      // You could add a toast notification here
    });

    return () => {
      socket.disconnect();
    };
  }, [setConnectionStatus, updateGameState, addMove, setDrawOffer]);

  const createRoom = (playerName: string, timeControl: any) => {
    if (socketRef.current) {
      socketRef.current.emit('create-room', { playerName, timeControl });
    }
  };

  const joinRoom = (roomId: string, playerName: string, preferredColor?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', { roomId, playerName, preferredColor });
    }
  };

  const spectateRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('spectate-room', { roomId });
    }
  };

  const makeMove = (from: string, to: string, promotion?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('make-move', { from, to, promotion });
    }
  };

  const resign = () => {
    if (socketRef.current) {
      socketRef.current.emit('resign');
    }
  };

  const offerDraw = () => {
    if (socketRef.current) {
      socketRef.current.emit('offer-draw');
    }
  };

  const respondDraw = (accept: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('respond-draw', { accept });
    }
  };

  return {
    socket: socketRef.current,
    isConnected: useGameStore.getState().isConnected,
    createRoom,
    joinRoom,
    spectateRoom,
    makeMove,
    resign,
    offerDraw,
    respondDraw,
  };
};