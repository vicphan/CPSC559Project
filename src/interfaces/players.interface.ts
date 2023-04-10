import { Game } from '../interfaces/games.interface';
import gameModel from '../models/game.model';

export interface Player {
  _id: string;
  playerID: string,
  name: string;
  score: number;
  game: Game;
  joinCode: string;
  active: Boolean;
}

export function playerToJson(player) {
  return {
    playerID: player.playerID,
    name: player.name,
    score: player.score,
    active: player.active,
    joinCode: player.joinCode
  }
}

export function convertPlayerListToJson(playerList)
{
  playerList.forEach(convertToJson)
  
  return playerList;

}

function convertToJson(item, index, arr)
{
  arr[index] = playerToJson(item);
}