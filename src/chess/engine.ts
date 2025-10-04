import { ChessBoard } from './board.js';
import { MoveGenerator } from './moves.js';
import { Move, PieceColor, Square, GameResult } from '../types/index.js';

export class ChessEngine {
  private board: ChessBoard;
  private moveGen: MoveGenerator;
  private positionHistory: string[];

  constructor(fen?: string) {
    this.board = new ChessBoard(fen);
    this.moveGen = new MoveGenerator(this.board);
    this.positionHistory = [this.board.toFEN()];
  }

  makeMove(from: Square, to: Square, promotion?: string): Move | null {
    if (!this.moveGen.isValidMove(from, to)) {
      return null;
    }

    const move = this.moveGen.getLegalMoves(from).find(m => m.to === to);
    if (!move) return null;

    this.moveGen.applyMoveToBoard(this.board, move);

    const opponentColor = this.board.getTurn();
    move.isCheck = this.moveGen.isKingInCheck(this.board, opponentColor);
    move.isCheckmate = move.isCheck && this.isCheckmate();

    this.positionHistory.push(this.board.toFEN());

    return move;
  }

  isCheckmate(): boolean {
    return this.getAllLegalMoves().length === 0 && this.isCheck();
  }

  isStalemate(): boolean {
    return this.getAllLegalMoves().length === 0 && !this.isCheck();
  }

  isCheck(): boolean {
    return this.moveGen.isKingInCheck(this.board, this.board.getTurn());
  }

  isInsufficientMaterial(): boolean {
    const pieces: string[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board.positionToSquare({ row, col });
        const piece = this.board.getPiece(square);
        if (piece && piece[1] !== 'k') {
          pieces.push(piece);
        }
      }
    }

    if (pieces.length === 0) return true;

    if (pieces.length === 1) {
      const type = pieces[0]?.[1];
      return type === 'n' || type === 'b';
    }

    if (pieces.length === 2) {
      const types = pieces.map(p => p[1]).sort();
      return types[0] === 'b' && types[1] === 'b';
    }

    return false;
  }

  isThreefoldRepetition(): boolean {
    const currentPosition = this.board.toFEN().split(' ')[0];
    let count = 0;

    for (const fen of this.positionHistory) {
      if (fen.split(' ')[0] === currentPosition) {
        count++;
        if (count >= 3) return true;
      }
    }

    return false;
  }

  isFiftyMoveRule(): boolean {
    return this.board.getHalfMoveClock() >= 100;
  }

  getGameResult(): GameResult | null {
    if (this.isCheckmate()) return 'checkmate';
    if (this.isStalemate()) return 'stalemate';
    if (this.isInsufficientMaterial()) return 'insufficient-material';
    if (this.isThreefoldRepetition()) return 'threefold-repetition';
    if (this.isFiftyMoveRule()) return 'fifty-move-rule';
    return null;
  }

  getAllLegalMoves(): Move[] {
    const moves: Move[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board.positionToSquare({ row, col });
        const piece = this.board.getPiece(square);
        if (piece && piece[0] === this.board.getTurn()) {
          moves.push(...this.moveGen.getLegalMoves(square));
        }
      }
    }
    return moves;
  }

  getFEN(): string {
    return this.board.toFEN();
  }

  getTurn(): PieceColor {
    return this.board.getTurn();
  }

  getPositionHistory(): string[] {
    return [...this.positionHistory];
  }

  getHalfMoveClock(): number {
    return this.board.getHalfMoveClock();
  }
}
