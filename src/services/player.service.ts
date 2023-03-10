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

    const scores = [];
    const totalScore = 0;
    const active = true;

    const createdPlayerData: Player = await this.players.create({ name: name, game: game, scores: scores, active: active, totalScore: totalScore });

    return createdPlayerData;
  }

  // Update the players score
  public async submitAnswer(playerName: string, questionData: SubmitQuestionDto): Promise<Player> {
    if (isEmpty(questionData)) throw new HttpException(400, "questionData is empty");
    
    const player: Player = await this.players.findOne({name: playerName});
    if (!player) throw new HttpException(404, `Player could not be found`);

    let newPlayerScores = player.scores;

    if (questionData.correctAnswer) {
      newPlayerScores[questionData.questionIndex] = 1;
    }

    let newTotalScore =0;
    for (let i = 0; i < newPlayerScores.length; i++)
    {
      if (newPlayerScores[i] != null){
        newTotalScore += newPlayerScores[i];
      }
    }

    const updatedPlayer: Player = await this.players.findByIdAndUpdate(player._id, { scores: newPlayerScores, totalScore: newTotalScore });

    return updatedPlayer;
  }

  // finds the players of the specified game
  public async findGamePlayers(gameID: Game): Promise<Player[]> {
    const players: Player[] = await this.players.find({ game: gameID });

    return players;
  }
}

export default PlayerService;
