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

}

export default GameService;
