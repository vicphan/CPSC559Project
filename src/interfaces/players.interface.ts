import { Game } from '../interfaces/games.interface';

export interface Player {
  _id: string;
  name: string;
  totalScore: number;
  scores: number[];
  game: Game;
  active: Boolean;
}
