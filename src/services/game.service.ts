import { HttpException } from '../exceptions/HttpException';
import { Game } from '../interfaces/games.interface';
import { Player } from '../interfaces/players.interface';
import gameModel from '../models/game.model';
import playerModel from '../models/player.model';
import { isEmpty } from '../utils/util';
import PlayerService from './player.service';
import { Question } from '../interfaces/questions.interface';
import questionModel from '../models/question.model';
import { SyncGameDto } from '@/dtos/syncGame.dto';

class GameService {
  public games = gameModel;
  public players = playerModel;
  public playerService = new PlayerService();
  public questions = questionModel;

  // returns all the games running
  public async findAllGames(): Promise<Game[]> {
    const games: Game[] = await this.games.find();

    return games;
  }

  // creates a new game with a join code from the frontend
  public async createGame(joinCode: string): Promise<Game> {
    const existingGame: Game = await this.games.findOne({ joinCode: joinCode });
    if (existingGame) throw new HttpException(466, 'Game with joinCode already exists');

    const started = false;
    const leaderboard: String[] = [];
    const currentQuestion = 0;
    const createGameData: Game = await this.games.create({
      joinCode: joinCode,
      started: started,
      leaderboard: leaderboard,
      currentQuestion: currentQuestion,
    });

    return createGameData;
  }

  // returns a game found by its game ID
  public async getGameByID(gameID: string): Promise<Game> {
    const game: Game = await this.games.findById({ _id: gameID });
    return game;
  }

  public async getGameByJoinCode(gameJoinCode: string): Promise<Game> {
    const game: Game = await this.games.findOne({ joinCode: gameJoinCode });
    return game;
  }

  // get all the active players in the game
  public async getActivePlayers(gameID: string) {
    const game: Game = await this.games.findById({ _id: gameID });

    const playerList: Player[] = [];
    const playerInGameCursor = this.players.find({ game: gameID }).cursor();
    for (let player: Player = await playerInGameCursor.next(); player != null; player = await playerInGameCursor.next()) {
      if (player.active) {
        playerList.push(player);
      }
    }

    return playerList;
  }

  // starts a game when players are ready
  public async startGame(joinCode: string): Promise<Game> {
    const started = true;

    const updateGameById: Game = await this.games.findOneAndUpdate({ joinCode: joinCode }, { started: started });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    const updated: Game = await this.games.findById(updateGameById._id);
    return updated;
  }

  // ends the game when the host decides to or all questions have been answered
  public async endGame(joinCode: string): Promise<Game> {
    const game: Game = await this.getGameByJoinCode(joinCode);

    let deletedPlayer: Player = await this.players.findOneAndDelete({ game: game._id });
    while (deletedPlayer) {
      deletedPlayer = await this.players.findOneAndDelete({ game: game._id });
    }

    const updateGameById: Game = await this.games.findByIdAndDelete(game._id);
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // returns game with updated leaderboard
  public async getLeaderboard(joinCode: string): Promise<Game> {
    const game: Game = await this.getGameByJoinCode(joinCode);

    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(game)).sort((a, b) => (a.totalScore > b.totalScore ? 1 : -1));

    // get updated leaderboard
    const leaderboard: string[] = await this.updateLeaderboard(players);

    // update game's leaderboard
    const updateGameById: Game = await this.games.findByIdAndUpdate(game._id, { leaderboard: leaderboard });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // returns current question for game with ID
  public async getQuestion(joinCode: string): Promise<Question> {
    const game: Game = await this.getGameByJoinCode(joinCode);

    const question: Question = await this.questions.findOne({ index: game.currentQuestion });

    return question;
  }

  // Move to the next question
  public async nextQuestion(joinCode: string): Promise<Game> {
    const game: Game = await this.getGameByJoinCode(joinCode);

    let nextQuestion = game.currentQuestion + 1;

    const question: Question = await this.questions.findOne({ index: nextQuestion });
    if (!question) {
      nextQuestion = 0;
    }

    const updatedGame: Game = await this.games.findByIdAndUpdate(game._id, { currentQuestion: nextQuestion });

    return updatedGame;
  }

  public async deleteQuestions(): Promise<void> {
    await this.questions.deleteMany({});
  }

  // updates the leader board with the players that have the top 10 scores
  // if there are less than 10 players, the leaderboard contains all the players
  public async updateLeaderboard(players: Player[]): Promise<string[]> {
    const leaderboard: string[] = [];

    let maxPlayers = 10;
    if (players.length < 10) {
      maxPlayers = players.length;
    }
    for (let i = 0; i < maxPlayers; i++) {
      leaderboard.push(players[i].name + ':' + players[i].totalScore.toString());
    }
    return leaderboard;
  }

  // Sync the game with what other servers are doing
  public async syncGame(joinCode: string, gameData: SyncGameDto)
  {
    const game: Game = await this.getGameByJoinCode(joinCode);
  }

}

let gs;

export function getGameService(): GameService {
  if (!gs) {
    gs = new GameService();
  }
  return gs;
}
