export interface Game {
    _id: string;
    joinCode: string;
    started: boolean;
    leaderboard: Array<string>;
    currentQuestion: number;
  }

export function gameToJson(game) {
    return {
      joinCode: game.joinCode,
      started: game.started,
      leaderboard: game.leaderboard,
      currentQuestion: game.currentQuestion,
    }
  }

  export function convertGameListToJson(gameList)
  {
    gameList.forEach(convertToJson)
    
    return gameList;
  
  }
  
  function convertToJson(item, index, arr)
  {
    arr[index] = gameToJson(item);
  }