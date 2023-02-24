import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { Player } from '@interfaces/players.interface';
import { Game } from '@interfaces/games.interface';
import playerModel from '@models/player.model';
import { isEmpty } from '@utils/util';
import gameModel from '@/models/game.model';

class PlayerService {
  public players = playerModel;
  public games = gameModel;

  public async findAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.players.find();
    
    return players;
  }

  public async createPlayer(): Promise<Player> {

    const name = "Name";
    const game: Game = await this.games.findOne({joinCode: "3fdrb"})
    const score = 0;

    const createdPlayerData: Player = await this.players.create({ name: name, game: game, score: score  });

    return createdPlayerData;
  }

}

export default PlayerService;
