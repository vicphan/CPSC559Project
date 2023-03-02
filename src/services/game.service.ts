import { HttpException } from '@exceptions/HttpException';
import { Game } from '@interfaces/games.interface';
import { Player } from '@interfaces/players.interface';
import gameModel from '@models/game.model';
import playerModel from '@models/player.model';
import { isEmpty } from '@utils/util';
import PlayerService from './player.service';

class GameService {
  public games = gameModel;
  public players = playerModel;
  public playerService = new PlayerService();

  // returns all the games running
  public async findAllGames(): Promise<Game[]> {
    const games: Game[] = await this.games.find();

    return games;
  }

  // creates a randomized join code for a new game
  public createJoinCode()
  {
    return (Math.random() + 1).toString(36).substring(7);
  }

  // creates a new game with a new join code
  public async createGame(): Promise<Game> {

    var joinCode = this.createJoinCode();
    const findGame: Game = await this.games.findOne({joinCode: joinCode})

    while(findGame)
    {
      joinCode =  this.createJoinCode();
      const findGame: Game = await this.games.findOne({joinCode: joinCode})
    }

    var started = false;
    let leaderboard: String[] = [];

    const createGameData: Game = await this.games.create({ joinCode: joinCode, started: started, leaderboard: leaderboard });

    return createGameData;
  }

  // returns a game found by its game ID
  public async getGameByID(gameID: string): Promise<Game>
  {
    const game: Game = await this.games.findById({_id: gameID});
    return game;
  }

  // get all the active players in the game
  public async getActivePlayers(gameID: string)
  {
    const game: Game = await this.games.findById({_id: gameID});

    var playerList: Player[] = [];
    var playerInGameCursor = this.players.find({game: gameID}).cursor();
    for (let player: Player = await playerInGameCursor.next(); player != null; player = await playerInGameCursor.next()) 
    {
      if (player.active)
      {
        playerList.push(player);
      }
    }

    return playerList;
  }

  // starts a game when players are ready
  public async startGame(gameId: string): Promise<Game> {

    const started = true;

    const updateGameById: Game = await this.games.findByIdAndUpdate(gameId, { started: started });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // ends the game when the host decides to or all questions have been answered
  public async endGame(gameId: string): Promise<Game> {

    var deletedPlayer: Player = await this.players.findOneAndDelete({game: gameId});
    while (deletedPlayer) 
    {
      deletedPlayer = await this.players.findOneAndDelete({game: gameId});
    }

    const updateGameById: Game = await this.games.findByIdAndDelete(gameId);
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // returns game with updated leaderboard
  public async getLeaderboard(gameID: string): Promise<Game>
  {
    if (isEmpty(gameID)) throw new HttpException(400, "game is empty");
    
    const playerGame: Game = await this.getGameByID(gameID);
    
    // find all players
    const players: Player[] = (await this.playerService.findGamePlayers(playerGame)).sort((a, b) => (a.score > b.score) ? 1 : -1);
    
    // get updated leaderboard
    let leaderboard: string[] = await this.updateLeaderboard(players);

    // update game's leaderboard
    const updateGameById: Game = await this.games.findByIdAndUpdate(gameID, { leaderboard: leaderboard });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");

    return updateGameById;
  }

  // updates the leader board with the players that have the top 10 scores 
  // if there are less than 10 players, the leaderboard contains all the players
  public async updateLeaderboard(players: Player[]): Promise<string[]>
  {
    let leaderboard: string[] = []

    let maxPlayers: number = 10;
    if (players.length < 10) {
      maxPlayers = players.length;
    }
    for (let i = 0; i < maxPlayers; i++)
    {
      leaderboard.push(players[i].name + ":" + players[i].score.toString());
    }
   return leaderboard;
  }
}

export default GameService;