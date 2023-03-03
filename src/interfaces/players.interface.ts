import { Game } from '../interfaces/games.interface';

export interface Player {
  _id: string;
  name: string;
  score: number;
  game: Game;
  active: Boolean;
}
