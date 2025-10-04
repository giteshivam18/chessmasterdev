import { ChessBoard } from './board.js';
import { Piece, PieceColor, PieceType, Square, Position, Move } from '../types/index.js';

export class MoveGenerator {
  private board: ChessBoard;

  constructor(board: ChessBoard) {
    this.board = board;
  }

  isValidMove(from: Square, to: Square): boolean {
    const piece = this.board.getPiece(from);
    if (!piece) return false;

    const color = piece[0] as PieceColor;
    if (color !== this.board.getTurn()) return false;

    const moves = this.getLegalMoves(from);
    return moves.some(move => move.to === to);
  }

  getLegalMoves(square: Square): Move[] {
    const piece = this.board.getPiece(square);
    if (!piece) return [];

    const pseudoLegalMoves = this.getPseudoLegalMoves(square);
    return pseudoLegalMoves.filter(move => {
      const testBoard = this.board.clone();
      this.applyMoveToBoard(testBoard, move);
      return !this.isKingInCheck(testBoard, piece[0] as PieceColor);
    });
  }

  private getPseudoLegalMoves(square: Square): Move[] {
    const piece = this.board.getPiece(square);
    if (!piece) return [];

    const type = piece[1] as PieceType;
    const color = piece[0] as PieceColor;

    switch (type) {
      case 'p':
        return this.getPawnMoves(square, color);
      case 'n':
        return this.getKnightMoves(square, color);
      case 'b':
        return this.getBishopMoves(square, color);
      case 'r':
        return this.getRookMoves(square, color);
      case 'q':
        return this.getQueenMoves(square, color);
      case 'k':
        return this.getKingMoves(square, color);
      default:
        return [];
    }
  }

  private getPawnMoves(square: Square, color: PieceColor): Move[] {
    const moves: Move[] = [];
    const pos = this.board.squareToPosition(square);
    const direction = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    const promotionRow = color === 'w' ? 0 : 7;

    const oneStep = { row: pos.row + direction, col: pos.col };
    if (this.isInBounds(oneStep) && !this.board.getPiece(this.board.positionToSquare(oneStep))) {
      const to = this.board.positionToSquare(oneStep);
      if (oneStep.row === promotionRow) {
        for (const promo of ['q', 'r', 'b', 'n'] as PieceType[]) {
          moves.push(this.createMove(square, to, false, false, promo));
        }
      } else {
        moves.push(this.createMove(square, to, false, false));
      }

      if (pos.row === startRow) {
        const twoStep = { row: pos.row + 2 * direction, col: pos.col };
        if (!this.board.getPiece(this.board.positionToSquare(twoStep))) {
          moves.push(this.createMove(square, this.board.positionToSquare(twoStep), false, false));
        }
      }
    }

    for (const colOffset of [-1, 1]) {
      const capturePos = { row: pos.row + direction, col: pos.col + colOffset };
      if (this.isInBounds(capturePos)) {
        const captureSq = this.board.positionToSquare(capturePos);
        const targetPiece = this.board.getPiece(captureSq);
        if (targetPiece && targetPiece[0] !== color) {
          if (capturePos.row === promotionRow) {
            for (const promo of ['q', 'r', 'b', 'n'] as PieceType[]) {
              moves.push(this.createMove(square, captureSq, false, false, promo));
            }
          } else {
            moves.push(this.createMove(square, captureSq, false, false));
          }
        }

        if (captureSq === this.board.getEnPassantSquare()) {
          moves.push(this.createMove(square, captureSq, false, true));
        }
      }
    }

    return moves;
  }

  private getKnightMoves(square: Square, color: PieceColor): Move[] {
    const moves: Move[] = [];
    const pos = this.board.squareToPosition(square);
    const offsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [rowOff, colOff] of offsets) {
      const newPos = { row: pos.row + rowOff!, col: pos.col + colOff! };
      if (this.isInBounds(newPos)) {
        const targetSq = this.board.positionToSquare(newPos);
        const targetPiece = this.board.getPiece(targetSq);
        if (!targetPiece || targetPiece[0] !== color) {
          moves.push(this.createMove(square, targetSq, false, false));
        }
      }
    }

    return moves;
  }

  private getBishopMoves(square: Square, color: PieceColor): Move[] {
    return this.getSlidingMoves(square, color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
  }

  private getRookMoves(square: Square, color: PieceColor): Move[] {
    return this.getSlidingMoves(square, color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
  }

  private getQueenMoves(square: Square, color: PieceColor): Move[] {
    return this.getSlidingMoves(square, color, [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]);
  }

  private getSlidingMoves(square: Square, color: PieceColor, directions: number[][]): Move[] {
    const moves: Move[] = [];
    const pos = this.board.squareToPosition(square);

    for (const [rowDir, colDir] of directions) {
      let distance = 1;
      while (true) {
        const newPos = {
          row: pos.row + rowDir! * distance,
          col: pos.col + colDir! * distance
        };

        if (!this.isInBounds(newPos)) break;

        const targetSq = this.board.positionToSquare(newPos);
        const targetPiece = this.board.getPiece(targetSq);

        if (!targetPiece) {
          moves.push(this.createMove(square, targetSq, false, false));
          distance++;
        } else {
          if (targetPiece[0] !== color) {
            moves.push(this.createMove(square, targetSq, false, false));
          }
          break;
        }
      }
    }

    return moves;
  }

  private getKingMoves(square: Square, color: PieceColor): Move[] {
    const moves: Move[] = [];
    const pos = this.board.squareToPosition(square);
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [rowOff, colOff] of offsets) {
      const newPos = { row: pos.row + rowOff!, col: pos.col + colOff! };
      if (this.isInBounds(newPos)) {
        const targetSq = this.board.positionToSquare(newPos);
        const targetPiece = this.board.getPiece(targetSq);
        if (!targetPiece || targetPiece[0] !== color) {
          moves.push(this.createMove(square, targetSq, false, false));
        }
      }
    }

    const castlingMoves = this.getCastlingMoves(color);
    moves.push(...castlingMoves);

    return moves;
  }

  private getCastlingMoves(color: PieceColor): Move[] {
    const moves: Move[] = [];
    const rights = this.board.getCastlingRights();
    const row = color === 'w' ? 7 : 0;
    const kingSq = this.board.positionToSquare({ row, col: 4 });

    if (this.isKingInCheck(this.board, color)) return moves;

    if (color === 'w' && rights.K) {
      if (this.canCastle(color, 'kingside')) {
        moves.push(this.createMove(kingSq, 'g1', true, false));
      }
    }
    if (color === 'w' && rights.Q) {
      if (this.canCastle(color, 'queenside')) {
        moves.push(this.createMove(kingSq, 'c1', true, false));
      }
    }
    if (color === 'b' && rights.k) {
      if (this.canCastle(color, 'kingside')) {
        moves.push(this.createMove(kingSq, 'g8', true, false));
      }
    }
    if (color === 'b' && rights.q) {
      if (this.canCastle(color, 'queenside')) {
        moves.push(this.createMove(kingSq, 'c8', true, false));
      }
    }

    return moves;
  }

  private canCastle(color: PieceColor, side: 'kingside' | 'queenside'): boolean {
    const row = color === 'w' ? 7 : 0;
    const squares = side === 'kingside'
      ? [{ row, col: 5 }, { row, col: 6 }]
      : [{ row, col: 1 }, { row, col: 2 }, { row, col: 3 }];

    for (const pos of squares) {
      const sq = this.board.positionToSquare(pos);
      if (this.board.getPiece(sq)) return false;
    }

    const checkSquares = side === 'kingside'
      ? [{ row, col: 4 }, { row, col: 5 }, { row, col: 6 }]
      : [{ row, col: 4 }, { row, col: 3 }, { row, col: 2 }];

    for (const pos of checkSquares) {
      const testBoard = this.board.clone();
      testBoard.setPiece(testBoard.positionToSquare(pos), `${color}k` as Piece);
      if (this.isKingInCheck(testBoard, color)) return false;
    }

    return true;
  }

  private createMove(from: Square, to: Square, isCastling: boolean, isEnPassant: boolean, promotion?: PieceType): Move {
    const piece = this.board.getPiece(from)!;
    const capturedPiece = this.board.getPiece(to);

    return {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined,
      promotion,
      isCastling,
      isEnPassant,
      isCheck: false,
      isCheckmate: false
    };
  }

  private isInBounds(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }

  isKingInCheck(board: ChessBoard, color: PieceColor): boolean {
    const kingSquare = this.findKing(board, color);
    if (!kingSquare) return false;

    const opponentColor = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(board, kingSquare, opponentColor);
  }

  private findKing(board: ChessBoard, color: PieceColor): Square | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = { row, col };
        const square = board.positionToSquare(pos);
        const piece = board.getPiece(square);
        if (piece === `${color}k`) {
          return square;
        }
      }
    }
    return null;
  }

  private isSquareAttacked(board: ChessBoard, square: Square, byColor: PieceColor): boolean {
    const originalBoard = this.board;
    this.board = board;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = { row, col };
        const fromSquare = board.positionToSquare(pos);
        const piece = board.getPiece(fromSquare);

        if (piece && piece[0] === byColor) {
          const moves = this.getPseudoLegalMoves(fromSquare);
          if (moves.some(move => move.to === square)) {
            this.board = originalBoard;
            return true;
          }
        }
      }
    }

    this.board = originalBoard;
    return false;
  }

  applyMoveToBoard(board: ChessBoard, move: Move): void {
    const piece = board.getPiece(move.from);
    if (!piece) return;

    const color = piece[0] as PieceColor;
    const type = piece[1] as PieceType;

    if (type === 'p' || move.capturedPiece) {
      board.resetHalfMoveClock();
    } else {
      board.incrementHalfMoveClock();
    }

    if (move.isEnPassant) {
      const enPassantRow = color === 'w' ? 4 : 3;
      const captureCol = move.to.charCodeAt(0) - 97;
      const captureSquare = board.positionToSquare({ row: enPassantRow, col: captureCol });
      board.setPiece(captureSquare, null);
    }

    if (move.isCastling) {
      const row = color === 'w' ? 7 : 0;
      const isKingside = move.to.charCodeAt(0) > move.from.charCodeAt(0);

      if (isKingside) {
        const rookFrom = board.positionToSquare({ row, col: 7 });
        const rookTo = board.positionToSquare({ row, col: 5 });
        board.setPiece(rookTo, board.getPiece(rookFrom));
        board.setPiece(rookFrom, null);
      } else {
        const rookFrom = board.positionToSquare({ row, col: 0 });
        const rookTo = board.positionToSquare({ row, col: 3 });
        board.setPiece(rookTo, board.getPiece(rookFrom));
        board.setPiece(rookFrom, null);
      }
    }

    board.setPiece(move.to, move.promotion ? `${color}${move.promotion}` as Piece : piece);
    board.setPiece(move.from, null);

    if (type === 'p') {
      const fromRow = board.squareToPosition(move.from).row;
      const toRow = board.squareToPosition(move.to).row;
      if (Math.abs(fromRow - toRow) === 2) {
        const enPassantRow = color === 'w' ? fromRow - 1 : fromRow + 1;
        const enPassantCol = board.squareToPosition(move.from).col;
        board.setEnPassantSquare(board.positionToSquare({ row: enPassantRow, col: enPassantCol }));
      } else {
        board.setEnPassantSquare(null);
      }
    } else {
      board.setEnPassantSquare(null);
    }

    if (type === 'k') {
      if (color === 'w') {
        board.setCastlingRight('K', false);
        board.setCastlingRight('Q', false);
      } else {
        board.setCastlingRight('k', false);
        board.setCastlingRight('q', false);
      }
    }

    if (type === 'r') {
      const fromPos = board.squareToPosition(move.from);
      if (color === 'w') {
        if (fromPos.col === 7) board.setCastlingRight('K', false);
        if (fromPos.col === 0) board.setCastlingRight('Q', false);
      } else {
        if (fromPos.col === 7) board.setCastlingRight('k', false);
        if (fromPos.col === 0) board.setCastlingRight('q', false);
      }
    }

    board.setTurn(color === 'w' ? 'b' : 'w');
    if (color === 'b') {
      board.incrementFullMoveNumber();
    }
  }
}
