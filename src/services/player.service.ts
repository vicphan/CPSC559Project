import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/HttpException';
import { Player } from '@interfaces/players.interface';
import { Game } from '@interfaces/games.interface';
import playerModel from '@models/player.model';
import { isEmpty } from '@utils/util';
import gameModel from '@/models/game.model';
import { CreatePlayerDto } from '@dtos/players.dto';
import { SubmitQuestionDto } from '@/dtos/submitQuestion.dto';
import { Question } from '@/interfaces/questions.interface';
import questionModel from '@models/question.model';

class PlayerService {
  public players = playerModel;
  public games = gameModel;
  public questions = questionModel;


  public async findAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.players.find();
    
    return players;
  }

  public async createPlayer(playerData: CreatePlayerDto): Promise<Player> {
    if (isEmpty(playerData)) throw new HttpException(400, "playerData is empty");

    const name = playerData.name;
    
    const game: Game = await this.games.findOne({joinCode: playerData.joinCode})
    if (!game) throw new HttpException(404, `Game ${playerData.joinCode} could not be found`);

    const score = 0;

    const createdPlayerData: Player = await this.players.create({ name: name, game: game, score: score  });

    return createdPlayerData;
  }

  public async submitAnswer(playerId: string, questionData: SubmitQuestionDto): Promise<Player> {
    if (isEmpty(questionData)) throw new HttpException(400, "questionData is empty");
    
    const question: Question = await this.questions.findOne({prompt: questionData.prompt})
    if (!question) throw new HttpException(404, `Question ${questionData.prompt} could not be found`);

    const player: Player = await this.players.findOne({_id: playerId})
    var score = player.score;

    if (questionData.answerIndex == question.correctAnswerIndex)
    {
      score = score + 1;
    }

    const updatedPlayer: Player = await this.players.findByIdAndUpdate(playerId, { score: score });

    return updatedPlayer;
  }

}

export default PlayerService;
