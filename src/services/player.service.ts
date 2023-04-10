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
    const gameCode = playerData.joinCode;

    const game: Game = await this.games.findOne({ joinCode: gameCode });
    if (!game) throw new HttpException(404, `Game ${gameCode} could not be found`);

    // check to see if a player with the same playerID already exists
    // playerID is created with the player name + joinCode so that unique names are per game
    const player: Player = await this.players.findOne({playerID: name + gameCode});
    if(player) throw new HttpException(409, `Player with the name '${name}' in game '${gameCode}' already exists`);

    if (game.started) throw new HttpException(203, `Game ${playerData.joinCode} already started`);

    if (game.currentQuestion >= 12) throw new HttpException(454, `Game ${playerData.joinCode} has ended`);

    const score = 0;
    const active = true;

    const createdPlayerData: Player = await this.players.create({ name: name, game: game, score: score, active: active, joinCode: gameCode, playerID: name + playerData.joinCode });

    return createdPlayerData;
  }

  // Update the players score
  public async submitAnswer(playerName: string, questionData: SubmitQuestionDto): Promise<Player> {
    if (isEmpty(questionData)) throw new HttpException(400, "questionData is empty");
    
    const player: Player = await this.players.findOne({name: playerName});
    if (!player) throw new HttpException(404, `Player could not be found`);

    let newPlayerScore = player.score;

    newPlayerScore = newPlayerScore + questionData.correctAnswer;

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
