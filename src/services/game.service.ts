import { HttpException } from '../exceptions/HttpException';
import { convertGameListToJson, Game } from '../interfaces/games.interface';
import { Player, convertPlayerListToJson } from '../interfaces/players.interface';
import gameModel from '../models/game.model';
import playerModel from '../models/player.model';
import PlayerService from './player.service';
import { Question } from '../interfaces/questions.interface';
import questionModel from '../models/question.model';
import { RequestSyncDto, SyncDatabaseDto } from '@/dtos/syncDatabase.dto';

class GameService {
  public games = gameModel;
  public players = playerModel;
  public playerService = new PlayerService();
  public questions = questionModel;
  public axios = require('axios');

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
    if (!game) throw new HttpException(444, "Game doesn't exist");

    return game;
  }

  // Get the game based on its join code
  public async getGameByJoinCode(gameJoinCode: string): Promise<Game> {
    const game: Game = await this.games.findOne({ joinCode: gameJoinCode });
    if (!game) throw new HttpException(444, "Game doesn't exist");

    return game;
  }

  // get all the active players in the game
  public async getActivePlayers(gameCode: string) {
    const game: Game = await this.getGameByJoinCode(gameCode);
    if (!game) throw new HttpException(444, "Game doesn't exist");

    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(game));
    return players;
  }

  // starts a game based on join code
  public async startGame(joinCode: string): Promise<Game> {
    const started = true;

    const updateGameById: Game = await this.games.findOneAndUpdate({ joinCode: joinCode }, { started: started });
    if (!updateGameById) throw new HttpException(444, "Game doesn't exist");

    const updated: Game = await this.games.findById(updateGameById._id);

    return updated;
  }

  // ends the game when the host decides to
  public async endGame(joinCode: string): Promise<Game> {
    const game: Game = await this.getGameByJoinCode(joinCode);

    let deletedPlayer: Player = await this.players.findOneAndDelete({ game: game._id });
    while (deletedPlayer) {
      deletedPlayer = await this.players.findOneAndDelete({ game: game._id });
    }

    const updateGameById: Game = await this.games.findByIdAndDelete(game._id);
    if (!updateGameById) throw new HttpException(444, "Game doesn't exist");

    return updateGameById;
  }

  // returns game with updated leaderboard
  public async getLeaderboard(joinCode: string): Promise<Game> {
    const game: Game = await this.getGameByJoinCode(joinCode);

    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(game)).sort((a, b) => (a.score > b.score ? 1 : -1));

    // get updated leaderboard
    const leaderboard: string[] = await this.updateLeaderboard(players);

    // update game's leaderboard
    const updateGameById: Game = await this.games.findByIdAndUpdate(game._id, { leaderboard: leaderboard });
    if (!updateGameById) throw new HttpException(444, "Game doesn't exist");

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

    // Move to next question, if at last question end game
    const question: Question = await this.questions.findOne({ index: nextQuestion });
    if (question) {
      return await this.games.findByIdAndUpdate(game._id, { currentQuestion: nextQuestion });
    }
    else
    {
      return await this.games.findByIdAndUpdate(game._id, { started: false });
    }
  }

  // Delete all questions
  public async deleteQuestions(): Promise<void> {
    await this.questions.deleteMany({});
  }

  // updates the leader board with the players that have the top 10 scores
  // if there are less than 10 players, the leaderboard contains all the players
  public async updateLeaderboard(players: Player[]): Promise<string[]> {
    const leaderboard: string[] = [];

    players.sort(((a, b) => (a.name > b.name) ? 1 : -1));

    let maxPlayers = 10;
    if (players.length < 10) {
      maxPlayers = players.length;
    }
    for (let i = 0; i < maxPlayers; i++) {
      leaderboard.push(players[i].name + ':' + players[i].score.toString());
    }
    return leaderboard;
  }

  // Sync the entire database
  public async syncDatabase(syncData: SyncDatabaseDto)
  {
    
    // Clear current database
    await this.games.deleteMany({});
    await this.players.deleteMany({});

    // Sync games
    const gameList : Game[] = syncData.gameList;
    await this.copyGames(gameList);

    // Sync Players
    await this.copyPlayers(syncData.playerList);
  }

  // Copy games into database
  public async copyGames(gameList:  Game[])
  {
    const promises = gameList.map((game) => this.copyGame(game, this));
    await Promise.allSettled(promises);
  }

  // Copy one game into database
  public async copyGame(game: Game, self)
  {
    await self.games.create({
      joinCode: game.joinCode,
      started: game.started,
      leaderboard: game.leaderboard,
      currentQuestion: game.currentQuestion
    });
  }

  // Copy players into database
  public async copyPlayers(playerList)
  {
    playerList.forEach((player) => {this.copyPlayer(player, this)});
  }

  //Copy specific player into database
  public async copyPlayer(player, self)
  {
    const game : Game = await self.games.findOne({ joinCode: player.joinCode });
    await self.players.create({ 
      name: player.name, 
      game: game, 
      score: player.score, 
      active: player.active, 
      joinCode: player.joinCode,
      playerID: player.playerID });
  }

   // Send out sync database message
   public async requestSyncDatabase(requestData: RequestSyncDto)
   {
      const url = requestData.url + '/syncDatabase';
      // Send entire database in message
      const data = {
        gameList: convertGameListToJson(await this.games.find({})),
        playerList: convertPlayerListToJson(await this.players.find({}))
      }
      var code = 200;
      await this.axios.put(url, data).catch(err => {
        console.log(err, err.response);
        code = 555;
        });

      return code;
    }
  
    // Clear all data in database
  public async clearAll() {
    await this.questions.deleteMany({});
    await this.players.deleteMany({});
    await this.games.deleteMany({});
  }
}

let gs;

export function getGameService(): GameService {
  if (!gs) {
    gs = new GameService();
  }
  return gs;
}
