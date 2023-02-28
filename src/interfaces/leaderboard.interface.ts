import { Game } from '@interfaces/games.interface';
import { Player } from '@interfaces/players.interface';

export interface Leaderboard {
    _id: string;
    game: Game;
    leaders: Array<string>,
}