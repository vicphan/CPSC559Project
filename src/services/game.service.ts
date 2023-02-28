import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { Game } from '@interfaces/games.interface';
import gameModel from '@models/game.model';
import { isEmpty } from '@utils/util';

class GameService {
  public games = gameModel;

  public async findAllGames(): Promise<Game[]> {
    const games: Game[] = await this.games.find();
    
    return games;
  }

  public createJoinCode()
  {
    return (Math.random() + 1).toString(36).substring(7);
  }

  public async createGame(): Promise<Game> {

    var joinCode = this.createJoinCode();
    const findGame: Game = await this.games.findOne({joinCode: joinCode})

    while(findGame)
    {
      joinCode =  this.createJoinCode();
      const findGame: Game = await this.games.findOne({joinCode: joinCode})
    }
    

    console.log("Joing Code: " + joinCode.toString());
    const createGameData: Game = await this.games.create({ joinCode: joinCode });

    return createGameData;
  }

}

export default GameService;
