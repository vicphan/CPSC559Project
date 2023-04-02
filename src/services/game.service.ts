import { HttpException } from '../exceptions/HttpException';
import { Game } from '../interfaces/games.interface';
import { Player } from '../interfaces/players.interface';
import gameModel from '../models/game.model';
import playerModel from '../models/player.model';
import PlayerService from './player.service';
import { Question } from '../interfaces/questions.interface';
import questionModel from '../models/question.model';
import { SyncGameDto } from '@/dtos/syncDatabase.dto';
import { URL } from '../config';

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

    //this.sendSyncMessages(createGameData, -1);

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
  public async getActivePlayers(gameCode: string) {
    const game: Game = await this.getGameByJoinCode(gameCode);
    
    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(game));
    return players;
  }

  // starts a game when players are ready
  public async startGame(joinCode: string): Promise<Game> {
    const started = true;

    const updateGameById: Game = await this.games.findOneAndUpdate({ joinCode: joinCode }, { started: started });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    const updated: Game = await this.games.findById(updateGameById._id);
    
    //this.sendSyncMessages(updated, -1);

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
    const players: Player[] = (await this.playerService.findGamePlayers(game)).sort((a, b) => (a.score > b.score ? 1 : -1));

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

    //this.sendSyncMessages(updatedGame, nextQuestion-1);

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
      leaderboard.push(players[i].name + ':' + players[i].score.toString());
    }
    return leaderboard;
  }

  // Sync the entire database
  // If question index is -1 only check that game exists and players match
  public async syncDatabase(syncData: SyncGameDto)
  {
    // var different = false;
    // var game: Game = await this.getGameByJoinCode(joinCode);

    // //If the game doesnt exist yet create it
    // if (game == null)
    // {
    //   game = await this.createGame(joinCode);
    //   different = true;
    // }

    // //If sync is for the current question you missed the question update
    // if (game.currentQuestion == syncData.questionIndex)
    // {
    //   game = await this.nextQuestion(joinCode);
    //   different = true;
    // }

    // //Loop through every player in the sync message
    // var playerNames = Object.keys(syncData.playerScores);
    // for (let i = 0; i < playerNames.length; i++)
    // {
    //   var player: Player = await this.players.findOne({name: playerNames[i]});
      
    //   //If player doesn't exist in this game create them
    //   if (player == null)
    //   {
    //     player = await this.createPlayer(playerNames[i], game);
    //   }

    //   //Take the highest score if there is a difference
    //   var score = syncData.playerScores[playerNames[i]];
    //   if (player.scores[i] == null || player.scores[i] < score)
    //   {
    //     this.updatePlayerScore(player, syncData.questionIndex, score);
    //     different = true;
    //   }
    // }

    // //If sync resulted in a change send out sync message as others may have missed changes too 
    // if (different)
    // {
    //   this.sendSyncMessages(game, syncData.questionIndex);
    // }

    // return game;
  }

  // public async sendSyncMessages(game, questionIndex)
  // {
  //   const fs = require('fs');
  //   const allServers = fs.readFileSync('serverList.txt', 'utf-8');
  //   allServers.split(/\r?\n/).forEach((server) => {
  //     if (server != URL){
  //       this.sendSyncMessage(game, questionIndex, server);
  //     }
  //   });
  // }

  // public async sendSyncMessage(game, questionIndex, server)
  // {
  //   const url = server + '/games/sync/' + game.joinCode;
  //   const playerScores = await this.getPlayerScoresForQuestion(questionIndex, game._id)
  //   const data = {questionIndex: questionIndex,
  //                 playerScores: playerScores};
  //   var res = this.axios.put(url, data).catch(err => {
  //     console.log(err, err.response)
  // });
  //   console.log(res);
  // }

  // public async getPlayerScoresForQuestion(questionIndex, gameId)
  // {
  //   if (questionIndex == -1)
  //     return {};
    
  //   var playerScoreList = {};
    
  //   const playerInGameCursor = this.players.find({ game: gameId }).cursor();
  //   for (let player: Player = await playerInGameCursor.next(); player != null; player = await playerInGameCursor.next()) {
  //     playerScoreList[player.name] = player.scores[questionIndex];
  //   }

  //   return playerScoreList;
  // }

  // public async createPlayer(playerName, game): Promise<Player>
  // {
  //   var newPlayer: Player = await this.players.create({ name: playerName, game: game, scores: [], active: true, totalScore: 0 });
  //   return newPlayer;
  // }

  // public async updatePlayerScore(player, questionIndex, score)
  // {
  //   let newPlayerScores = player.scores;

  //   newPlayerScores[questionIndex] = score;

  //   let newTotalScore =0;
  //   for (let i = 0; i < newPlayerScores.length; i++)
  //   {
  //     if (newPlayerScores[i] != null){
  //       newTotalScore += newPlayerScores[i];
  //     }
  //   }

  //   await this.players.findByIdAndUpdate(player._id, { scores: newPlayerScores, totalScore: newTotalScore });
  // }
  
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
