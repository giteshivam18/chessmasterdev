import { Player, GameMode, TimeControl } from '../types/index.js';

interface MatchmakingRequest {
  player: Player;
  mode: GameMode;
  timeControl: TimeControl;
  timestamp: number;
}

export class MatchmakingService {
  private queue: Map<string, MatchmakingRequest>;

  constructor() {
    this.queue = new Map();
  }

  addToQueue(player: Player, mode: GameMode, timeControl: TimeControl): void {
    const key = this.getQueueKey(mode, timeControl);
    this.queue.set(player.id, {
      player,
      mode,
      timeControl,
      timestamp: Date.now()
    });
  }

  removeFromQueue(playerId: string): void {
    this.queue.delete(playerId);
  }

  findMatch(player: Player, mode: GameMode, timeControl: TimeControl): MatchmakingRequest | null {
    const ratingRange = 200;

    for (const [id, request] of this.queue.entries()) {
      if (id === player.id) continue;

      if (
        request.mode === mode &&
        this.timeControlsMatch(request.timeControl, timeControl) &&
        Math.abs(request.player.rating - player.rating) <= ratingRange
      ) {
        this.queue.delete(id);
        return request;
      }
    }

    return null;
  }

  private timeControlsMatch(tc1: TimeControl, tc2: TimeControl): boolean {
    return (
      tc1.initial === tc2.initial &&
      tc1.increment === tc2.increment &&
      tc1.format === tc2.format
    );
  }

  private getQueueKey(mode: GameMode, timeControl: TimeControl): string {
    return `${mode}_${timeControl.initial}_${timeControl.increment}_${timeControl.format}`;
  }

  getQueueSize(): number {
    return this.queue.size;
  }

  isInQueue(playerId: string): boolean {
    return this.queue.has(playerId);
  }
}
