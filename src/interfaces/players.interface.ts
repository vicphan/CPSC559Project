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

//Convert player object to JSON
export function playerToJson(player) {
  return {
    playerID: player.playerID,
    name: player.name,
    score: player.score,
    active: player.active,
    joinCode: player.joinCode
  }
}

//Convert list of players to JSON
export function convertPlayerListToJson(playerList)
{
  playerList = playerList.sort(((a, b) => (a.name > b.name) ? 1 : -1));
  playerList.forEach(convertToJson)
  
  return playerList;

}

//Convert list element to JSON
function convertToJson(item, index, arr)
{
  arr[index] = playerToJson(item);
}