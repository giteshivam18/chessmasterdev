export class EloCalculator {
  private kFactor: number;

  constructor(kFactor: number = 32) {
    this.kFactor = kFactor;
  }

  calculateExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  calculateNewRating(currentRating: number, opponentRating: number, score: number): number {
    const expectedScore = this.calculateExpectedScore(currentRating, opponentRating);
    const change = Math.round(this.kFactor * (score - expectedScore));
    return currentRating + change;
  }

  updateRatings(
    player1Rating: number,
    player2Rating: number,
    result: 'player1' | 'player2' | 'draw'
  ): { player1NewRating: number; player2NewRating: number } {
    const score1 = result === 'player1' ? 1 : result === 'draw' ? 0.5 : 0;
    const score2 = result === 'player2' ? 1 : result === 'draw' ? 0.5 : 0;

    return {
      player1NewRating: this.calculateNewRating(player1Rating, player2Rating, score1),
      player2NewRating: this.calculateNewRating(player2Rating, player1Rating, score2)
    };
  }
}
