import { User, Game, GameInvite } from '../types/index.js';

export class InMemoryStorage {
  private users: Map<string, User>;
  private games: Map<string, Game>;
  private invites: Map<string, GameInvite>;
  private usersByEmail: Map<string, User>;
  private usersByUsername: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.invites = new Map();
    this.usersByEmail = new Map();
    this.usersByUsername = new Map();
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    this.usersByEmail.set(user.email, user);
    this.usersByUsername.set(user.username, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.usersByEmail.get(email);
  }

  getUserByUsername(username: string): User | undefined {
    return this.usersByUsername.get(username);
  }

  updateUser(user: User): User {
    this.users.set(user.id, user);
    this.usersByEmail.set(user.email, user);
    this.usersByUsername.set(user.username, user);
    return user;
  }

  saveGame(game: Game): Game {
    this.games.set(game.id, game);
    return game;
  }

  getGame(id: string): Game | undefined {
    return this.games.get(id);
  }

  getGamesByUser(userId: string): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.whitePlayer.id === userId || game.blackPlayer.id === userId
    );
  }

  getActiveGames(): Game[] {
    return Array.from(this.games.values()).filter(game => game.status === 'active');
  }

  createInvite(invite: GameInvite): GameInvite {
    this.invites.set(invite.id, invite);
    return invite;
  }

  getInvite(id: string): GameInvite | undefined {
    return this.invites.get(id);
  }

  getInvitesByUser(userId: string): GameInvite[] {
    return Array.from(this.invites.values()).filter(
      invite => invite.fromUserId === userId || invite.toUserId === userId
    );
  }

  updateInvite(invite: GameInvite): GameInvite {
    this.invites.set(invite.id, invite);
    return invite;
  }

  getLeaderboard(limit: number = 100): User[] {
    return Array.from(this.users.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
}
