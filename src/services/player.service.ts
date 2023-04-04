import { HttpException } from '../exceptions/HttpException';
import { Player } from '../interfaces/players.interface';
import { Game } from '../interfaces/games.interface';
import playerModel from '../models/player.model';
import { isEmpty } from '../utils/util';
import gameModel from '..//models/game.model';
import { CreatePlayerDto } from '../dtos/players.dto';
import { SubmitQuestionDto } from '..//dtos/submitQuestion.dto';
import questionModel from '../models/question.model';

class PlayerService {
  public players = playerModel;
  public games = gameModel;
  public questions = questionModel;

  // returns all the players for all games
  public async findAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.players.find();

    return players;
  }

  // creates a new player when they join a game
  public async createPlayer(playerData: CreatePlayerDto): Promise<Player> {
    if (isEmpty(playerData)) throw new HttpException(400, 'playerData is empty');

    const name = playerData.name;

    const game: Game = await this.games.findOne({ joinCode: playerData.joinCode });
    if (!game) throw new HttpException(404, `Game ${playerData.joinCode} could not be found`);

    const score = 0;
    const active = true;

    const createdPlayerData: Player = await this.players.create({ name: name, game: game, score: score, active: active, joinCode: playerData.joinCode });

    return createdPlayerData;
  }

  // Update the players score
  public async submitAnswer(playerName: string, questionData: SubmitQuestionDto): Promise<Player> {
    if (isEmpty(questionData)) throw new HttpException(400, "questionData is empty");
    
    const player: Player = await this.players.findOne({name: playerName});
    if (!player) throw new HttpException(404, `Player could not be found`);

    let newPlayerScore = player.score;

    if (questionData.correctAnswer) {
      newPlayerScore = newPlayerScore + 1;
    }

    const updatedPlayer: Player = await this.players.findByIdAndUpdate(player._id, { score: newPlayerScore });

    return updatedPlayer;
  }

  // finds the players of the specified game
  public async findGamePlayers(gameID: Game): Promise<Player[]> {
    const players: Player[] = await this.players.find({ game: gameID });

    return players;
  }
}

export default PlayerService;
