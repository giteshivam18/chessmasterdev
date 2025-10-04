import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Flag, 
  Handshake, 
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from 'lucide-react';
import ChessBoard from '../components/chess/ChessBoard';
import MoveHistory from '../components/chess/MoveHistory';
import CapturedPieces from '../components/chess/CapturedPieces';
import TimerDisplay from '../components/game/TimerDisplay';
import GameEndModal from '../components/game/GameEndModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useChessGame } from '../hooks/useChessGame';
import { useSocket } from '../hooks/useSocket';
import { useTimer } from '../hooks/useTimer';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useGameStore } from '../stores/gameStore';
import { useSettingsStore } from '../stores/settingsStore';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [showMoveHistory, setShowMoveHistory] = useState(true);
  const [showCapturedPieces] = useState(true);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  
  const { socket, isConnected } = useSocket();
  const { 
    turn, 
    isCheck, 
    moves, 
    makeMove, 
    isGameOver,
    gameResult 
  } = useChessGame();
  
  const { 
    whiteTime, 
    blackTime, 
    isRunning, 
    activePlayer, 
    switchTurn, 
    addIncrement
  } = useTimer(600000); // 10 minutes
  
  const { 
    playMove, 
    playCapture, 
    playCheck, 
    playVictory, 
    playDefeat, 
    playDraw,
    toggleMute,
    isMuted 
  } = useSoundEffects();
  
  const { 
    gameId: storeGameId, 
    playerColor, 
    opponentInfo, 
    gameStatus,
    setGame,
    setGameStatus,
    setOpponentInfo 
  } = useGameStore();
  
  const { showCoordinates } = useSettingsStore();

  // Initialize game
  useEffect(() => {
    if (gameId && !storeGameId) {
      // TODO: Load game from API
      const mockGame = {
        id: gameId,
        whitePlayer: {
          id: '1',
          username: 'Player1',
          rating: 1200,
          isOnline: true,
          lastSeen: Date.now(),
        },
        blackPlayer: {
          id: '2',
          username: 'Player2',
          rating: 1150,
          isOnline: true,
          lastSeen: Date.now(),
        },
        settings: {
          mode: 'blitz' as const,
          timeControl: { initial: 600000, increment: 2000 },
          rated: true,
          color: 'random' as const,
          variant: 'standard' as const,
          allowSpectators: true,
          private: false,
        },
        status: 'playing' as const,
        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moves: [],
        startTime: Date.now(),
        lastMoveTime: Date.now(),
        spectators: [],
        chat: [],
      };
      
      setGame(mockGame);
      setOpponentInfo(mockGame.blackPlayer);
      setGameStatus('playing');
    }
  }, [gameId, storeGameId, setGame, setOpponentInfo, setGameStatus]);

  // Handle moves
  const handleMove = (from: string, to: string, promotion?: string) => {
    const success = makeMove(from, to, promotion as any);
    if (success) {
      // Play sound effects
      const move = moves[moves.length - 1];
      if (move?.captured) {
        playCapture();
      } else {
        playMove();
      }
      
      if (isCheck) {
        playCheck();
      }
      
      // Switch timer
      switchTurn();
      addIncrement(activePlayer === 'white' ? 'black' : 'white');
      
      // Emit move to server
      if (socket) {
        socket.emit('game:move', {
          gameId,
          from,
          to,
          promotion,
        });
      }
    }
  };

  // Handle square click
  const handleSquareClick = (square: string | null) => {
    setSelectedSquare(square);
  };

  // Handle resign
  const handleResign = () => {
    if (socket) {
      socket.emit('game:resign', { gameId });
    }
    setShowGameEndModal(true);
  };

  // Handle draw offer
  const handleOfferDraw = () => {
    if (socket) {
      socket.emit('game:offer_draw', { gameId });
    }
  };

  // Handle game end
  useEffect(() => {
    if (isGameOver && gameResult) {
      setShowGameEndModal(true);
      
      // Play appropriate sound
      if (gameResult.result === 'win') {
        playVictory();
      } else if (gameResult.result === 'loss') {
        playDefeat();
      } else {
        playDraw();
      }
    }
  }, [isGameOver, gameResult, playVictory, playDefeat, playDraw]);

  // Get legal moves for selected square (currently unused but available for future use)
  // const selectedSquareLegalMoves = selectedSquare 
  //   ? getLegalMoves(selectedSquare).map(move => move.to)
  //   : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Game {gameId}
            </h1>
            <div className={clsx(
              'flex items-center space-x-2 text-sm',
              isConnected ? 'text-green-600' : 'text-red-600'
            )}>
              <div className={clsx(
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-red-500'
              )} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              leftIcon={isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoveHistory(!showMoveHistory)}
              leftIcon={showMoveHistory ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            >
              {showMoveHistory ? 'Hide' : 'Show'} Moves
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Timers */}
            <div className="space-y-2">
              <TimerDisplay
                timeRemaining={whiteTime}
                isActive={activePlayer === 'white' && isRunning}
                increment={2000}
                playerName="White"
                moveCount={Math.floor(moves.length / 2) + (moves.length % 2)}
              />
              <TimerDisplay
                timeRemaining={blackTime}
                isActive={activePlayer === 'black' && isRunning}
                increment={2000}
                playerName="Black"
                moveCount={Math.floor(moves.length / 2)}
              />
            </div>

            {/* Captured Pieces */}
            {showCapturedPieces && (
              <Card>
                <CapturedPieces
                  capturedWhite={moves.filter(m => m.color === 'b' && m.captured).map(m => m.captured!)}
                  capturedBlack={moves.filter(m => m.color === 'w' && m.captured).map(m => m.captured!)}
                />
              </Card>
            )}

            {/* Game Controls */}
            <Card>
              <div className="space-y-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleResign}
                  leftIcon={<Flag className="w-4 h-4" />}
                  fullWidth
                >
                  Resign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOfferDraw}
                  leftIcon={<Handshake className="w-4 h-4" />}
                  fullWidth
                >
                  Offer Draw
                </Button>
              </div>
            </Card>
          </div>

          {/* Chess Board */}
          <div className="lg:col-span-2">
            <div className="flex justify-center">
              <ChessBoard
                onMove={handleMove}
                orientation={playerColor}
                lastMove={moves[moves.length - 1] ? {
                  from: moves[moves.length - 1].from,
                  to: moves[moves.length - 1].to
                } : null}
                inCheck={isCheck}
                selectedSquare={selectedSquare}
                onSquareClick={handleSquareClick}
                disabled={gameStatus !== 'playing' || turn !== (playerColor === 'white' ? 'w' : 'b')}
                showCoordinates={showCoordinates}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {showMoveHistory && (
              <Card className="h-96">
                <MoveHistory
                  moves={moves}
                  currentMoveIndex={moves.length - 1}
                  onMoveClick={() => {
                    // TODO: Implement move navigation
                  }}
                />
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Game End Modal */}
      <GameEndModal
        isOpen={showGameEndModal}
        onClose={() => setShowGameEndModal(false)}
        result={gameResult || { result: 'draw', reason: 'agreement' }}
        gameData={{
          duration: Date.now() - (Date.now() - 300000), // Mock duration
          moves: moves.length,
          opponent: opponentInfo?.username || 'Unknown',
          mode: 'Blitz',
        }}
        onRematch={() => {
          // TODO: Implement rematch
        }}
        onNewGame={() => {
          // TODO: Navigate to lobby
        }}
        onAnalyze={() => {
          // TODO: Navigate to analysis
        }}
      />
    </div>
  );
};

export default GamePage;