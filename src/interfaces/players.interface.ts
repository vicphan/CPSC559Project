import { Game } from '../interfaces/games.interface';

export interface Player {
  _id: string;
  name: string;
  totalScore: number;
  scores: number[];
  game: Game;
  active: Boolean;
}

export function playerToJson(player) {
  return {
    name: player.name,
    totalScore: player.totalScore,
    scores: player.scores,
    game: player.game,
    active: player.active,
  }
}

export function convertPlayerListToJson(playerList)
{
  console.log(playerList)
  playerList.forEach(convertToJson)
  
  return playerList;

}

function convertToJson(item, index, arr)
{
  arr[index] = playerToJson(item);
}