import { Leaderboard } from "./leaderboard.interface";

export interface Game {
    _id: string;
    joinCode: string;
    started: boolean;
    leaderboard: Leaderboard;
  }