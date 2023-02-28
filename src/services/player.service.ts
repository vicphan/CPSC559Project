import { HttpException } from '@exceptions/HttpException';
import { Player } from '@interfaces/players.interface';
import { Game } from '@interfaces/games.interface';
import playerModel from '@models/player.model';
import { isEmpty } from '@utils/util';
import gameModel from '@/models/game.model';
import { CreatePlayerDto } from '@dtos/players.dto';

class PlayerService {
  public players = playerModel;
  public games = gameModel;

  // returns all the players for all games
  public async findAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.players.find();

    return players;
  }

  // creates a new player when they join a game
  public async createPlayer(playerData: CreatePlayerDto): Promise<Player> {
    if (isEmpty(playerData)) throw new HttpException(400, "playerData is empty");

    const name = playerData.name;
    
    const game: Game = await this.games.findOne({joinCode: playerData.joinCode})
    if (!game) throw new HttpException(404, `Game ${playerData.joinCode} could not be found`);

    const score = 0;

    const createdPlayerData: Player = await this.players.create({ name: name, game: game, score: score  });

    return createdPlayerData;
  }
  
  // finds the players of the specified game
  public async findGamePlayers(gameID: Game): Promise<Player[]> {
    const players: Player[] = await this.players.find({game: gameID});
  
    return players;
  }
}

export default PlayerService;