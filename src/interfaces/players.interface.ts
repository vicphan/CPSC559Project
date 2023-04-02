import { Game } from '../interfaces/games.interface';

export interface Player {
  _id: string;
  name: string;
  score: number;
  game: Game;
  active: Boolean;
}

export function playerToJson(player) {
  return {
    name: player.name,
    totalScore: player.totalScore,
    scores: player.scores,
    active: player.active,
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