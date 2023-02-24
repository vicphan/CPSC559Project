import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { Game } from '@interfaces/games.interface';
import { Player } from '@interfaces/players.interface';
import gameModel from '@models/game.model';
import playerModel from '@models/player.model';
import { isEmpty } from '@utils/util';

class GameService {
  public games = gameModel;
  public players = playerModel;

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
    
    var started = false;

    console.log("Joing Code: " + joinCode.toString());
    const createGameData: Game = await this.games.create({ joinCode: joinCode, started: started });

    return createGameData;
  }

  public async startGame(gameId: string): Promise<Game> {

    const started = true;

    const updateGameById: Game = await this.games.findByIdAndUpdate(gameId, { started: started });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  public async endGame(gameId: string): Promise<Game> {

    var deletedPlayer: Player = await this.players.findOneAndDelete({game: gameId});
    while (deletedPlayer) 
    {
      deletedPlayer = await this.players.findOneAndDelete({game: gameId});
    }

    const updateGameById: Game = await this.games.findByIdAndDelete(gameId);
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

}

export default GameService;
