import type { Square, PieceType, PieceColor } from '../types/chess.types';

/**
 * Convert square notation to coordinates
 */
export const squareToCoords = (square: Square): { x: number; y: number } => {
  const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
  const rank = parseInt(square[1]) - 1; // '1' = 0, '2' = 1, etc.
  return { x: file, y: 7 - rank }; // Flip rank for board display
};

/**
 * Convert coordinates to square notation
 */
export const coordsToSquare = (x: number, y: number): Square => {
  const file = String.fromCharCode(97 + x);
  const rank = 8 - y; // Flip rank back
  return `${file}${rank}` as Square;
};

/**
 * Check if a square is light or dark
 */
export const isLightSquare = (square: Square): boolean => {
  const { x, y } = squareToCoords(square);
  return (x + y) % 2 === 0;
};

/**
 * Get piece value for material calculation
 */
export const getPieceValue = (piece: PieceType): number => {
  const values: Record<PieceType, number> = {
    'p': 1,
    'n': 3,
    'b': 3,
    'r': 5,
    'q': 9,
    'k': 0, // King has no value in material calculation
  };
  return values[piece];
};

/**
 * Calculate material advantage
 */
export const calculateMaterialAdvantage = (
  capturedWhite: PieceType[],
  capturedBlack: PieceType[]
): number => {
  const whiteValue = capturedWhite.reduce((sum, piece) => sum + getPieceValue(piece), 0);
  const blackValue = capturedBlack.reduce((sum, piece) => sum + getPieceValue(piece), 0);
  return whiteValue - blackValue;
};

/**
 * Format material advantage for display
 */
export const formatMaterialAdvantage = (advantage: number): string => {
  if (advantage === 0) return '';
  const sign = advantage > 0 ? '+' : '';
  return `${sign}${advantage}`;
};

/**
 * Get piece symbol for display
 */
export const getPieceSymbol = (piece: PieceType, color: PieceColor): string => {
  const symbols: Record<PieceType, { w: string; b: string }> = {
    'k': { w: '♔', b: '♚' },
    'q': { w: '♕', b: '♛' },
    'r': { w: '♖', b: '♜' },
    'b': { w: '♗', b: '♝' },
    'n': { w: '♘', b: '♞' },
    'p': { w: '♙', b: '♟' },
  };
  return symbols[piece][color];
};

/**
 * Get piece name for display
 */
export const getPieceName = (piece: PieceType): string => {
  const names: Record<PieceType, string> = {
    'k': 'King',
    'q': 'Queen',
    'r': 'Rook',
    'b': 'Bishop',
    'n': 'Knight',
    'p': 'Pawn',
  };
  return names[piece];
};

/**
 * Check if a move is a special move (castling, en passant, promotion)
 */
export const isSpecialMove = (move: { flags: string }): boolean => {
  return move.flags.includes('b') || // Big castling
         move.flags.includes('e') || // En passant
         move.flags.includes('p');   // Promotion
};

/**
 * Get move type description
 */
export const getMoveType = (move: { flags: string; san: string }): string => {
  if (move.flags.includes('b')) return 'Castling (queenside)';
  if (move.flags.includes('k')) return 'Castling (kingside)';
  if (move.flags.includes('e')) return 'En passant';
  if (move.flags.includes('p')) return 'Promotion';
  if (move.san.includes('+')) return 'Check';
  if (move.san.includes('#')) return 'Checkmate';
  return 'Normal move';
};

/**
 * Validate square notation
 */
export const isValidSquare = (square: string): square is Square => {
  if (square.length !== 2) return false;
  const file = square[0];
  const rank = square[1];
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
};

/**
 * Get all squares on the board
 */
export const getAllSquares = (): Square[] => {
  const squares: Square[] = [];
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      squares.push(coordsToSquare(file, rank));
    }
  }
  return squares;
};

/**
 * Get squares in a rank
 */
export const getRankSquares = (rank: number): Square[] => {
  const squares: Square[] = [];
  for (let file = 0; file < 8; file++) {
    squares.push(coordsToSquare(file, rank));
  }
  return squares;
};

/**
 * Get squares in a file
 */
export const getFileSquares = (file: number): Square[] => {
  const squares: Square[] = [];
  for (let rank = 0; rank < 8; rank++) {
    squares.push(coordsToSquare(file, rank));
  }
  return squares;
};