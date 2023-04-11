export interface Game {
    _id: string;
    joinCode: string;
    started: boolean;
    leaderboard: Array<string>;
    currentQuestion: number;
  }

//Convert a game to a JSON object, without ID
export function gameToJson(game) {
    return {
      joinCode: game.joinCode,
      started: game.started,
      leaderboard: game.leaderboard,
      currentQuestion: game.currentQuestion,
    }
  }

  //Convert a list of games to a JSON object
  export function convertGameListToJson(gameList)
  {
    gameList = gameList.sort(((a, b) => (a.joinCode > b.joinCode) ? 1 : -1));
    gameList.forEach(convertToJson)
    
    return gameList;
  
  }
  
  //Convert list element to JSON
  function convertToJson(item, index, arr)
  {
    arr[index] = gameToJson(item);
  }