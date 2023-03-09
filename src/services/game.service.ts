import { HttpException } from '../exceptions/HttpException';
import { Game } from '../interfaces/games.interface';
import { Player } from '../interfaces/players.interface';
import gameModel from '../models/game.model';
import playerModel from '../models/player.model';
import { isEmpty } from '../utils/util';
import PlayerService from './player.service';
import { Question } from '../interfaces/questions.interface';
import questionModel from '../models/question.model';

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

  // creates a randomized join code for a new game
  public createJoinCode() {
    return (Math.random() + 1).toString(36).substring(7);
  }

  // creates a new game with a new join code
  public async createGame(): Promise<Game> {
    let joinCode = this.createJoinCode();
    const findGame: Game = await this.games.findOne({ joinCode: joinCode });

    while (findGame) {
      joinCode = this.createJoinCode();
      const findGame: Game = await this.games.findOne({ joinCode: joinCode });
    }

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
<<<<<<< HEAD
    const started = true;

    const updateGameById: Game = await this.games.findOneAndUpdate({ joinCode: joinCode }, { started: started });
=======
    
    const game: Game = await this.getGameByJoinCode(joinCode);

    const started = true;

    const updateGameById: Game = await this.games.findByIdAndUpdate(game._id, { started: started });
>>>>>>> 3bbc826cd9504eb4c79200e80d3a65ef4c1b5886
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // ends the game when the host decides to or all questions have been answered
<<<<<<< HEAD
  public async endGame(gameId: string): Promise<Game> {
    let deletedPlayer: Player = await this.players.findOneAndDelete({ game: gameId });
    while (deletedPlayer) {
      deletedPlayer = await this.players.findOneAndDelete({ game: gameId });
=======
  public async endGame(joinCode: string): Promise<Game> {

    const game: Game = await this.getGameByJoinCode(joinCode);

    var deletedPlayer: Player = await this.players.findOneAndDelete({game: game._id});
    while (deletedPlayer) 
    {
      deletedPlayer = await this.players.findOneAndDelete({game: game._id});
>>>>>>> 3bbc826cd9504eb4c79200e80d3a65ef4c1b5886
    }

    const updateGameById: Game = await this.games.findByIdAndDelete(game._id);
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // returns game with updated leaderboard
<<<<<<< HEAD
  public async getLeaderboard(gameID: string): Promise<Game> {
    if (isEmpty(gameID)) throw new HttpException(400, 'game is empty');

    const playerGame: Game = await this.getGameByID(gameID);

    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(playerGame)).sort((a, b) => (a.score > b.score ? 1 : -1));

=======
  public async getLeaderboard(joinCode: string): Promise<Game>
  {
    const game: Game = await this.getGameByJoinCode(joinCode);
    
    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(game)).sort((a, b) => (a.score > b.score) ? 1 : -1);
    
>>>>>>> 3bbc826cd9504eb4c79200e80d3a65ef4c1b5886
    // get updated leaderboard
    const leaderboard: string[] = await this.updateLeaderboard(players);

    // update game's leaderboard
    const updateGameById: Game = await this.games.findByIdAndUpdate(game._id, { leaderboard: leaderboard });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // returns current question for game with ID
<<<<<<< HEAD
  public async getQuestion(gameID: string): Promise<Question> {
    if (isEmpty(gameID)) throw new HttpException(400, 'game is empty');

    const game: Game = await this.getGameByID(gameID);
    if (!game) throw new HttpException(409, "Game doesn't exist");

    const question: Question = await this.questions.findOne({ index: game.currentQuestion });
=======
  public async getQuestion(joinCode: string): Promise<Question>
  {
    const game: Game = await this.getGameByJoinCode(joinCode);
  
    const question: Question = await this.questions.findOne({index: game.currentQuestion});
>>>>>>> 3bbc826cd9504eb4c79200e80d3a65ef4c1b5886

    return question;
  }

  // Move to the next question
<<<<<<< HEAD
  public async nextQuestion(gameID: string): Promise<Game> {
    if (isEmpty(gameID)) throw new HttpException(400, 'game is empty');

    const game: Game = await this.getGameByID(gameID);
    if (!game) throw new HttpException(409, "Game doesn't exist");

    let nextQuestion = game.currentQuestion + 1;

=======
  public async nextQuestion(joinCode: string): Promise<Game>
  {
    const game: Game = await this.getGameByJoinCode(joinCode);
    
    var nextQuestion = game.currentQuestion + 1;

>>>>>>> 3bbc826cd9504eb4c79200e80d3a65ef4c1b5886
    const question: Question = await this.questions.findOne({ index: nextQuestion });
    if (!question) {
      nextQuestion = 0;
    }

    const updatedGame: Game = await this.games.findByIdAndUpdate(game._id, { currentQuestion: nextQuestion });

    return updatedGame;
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
      leaderboard.push(players[i].name + ':' + players[i].score.toString());
    }
    return leaderboard;
  }
}

let gs;

export function getGameService(): GameService {
  if (!gs) {
    gs = new GameService();
  }
  return gs;
}
