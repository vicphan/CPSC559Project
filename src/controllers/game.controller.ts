import { NextFunction, Request, Response } from 'express';
import { Game, gameToJson, convertGameListToJson } from '../interfaces/games.interface';
import { getGameService } from '../services/game.service';
import { SyncDatabaseDto, RequestSyncDto} from '../dtos/syncDatabase.dto';
import { Question, questionToJson } from '../interfaces/questions.interface';
import { Player, convertPlayerListToJson, } from '../interfaces/players.interface';

class GamesController {
  public gameService = getGameService();

  // gets all running games
  public getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.gameService.findAllGames();

      res.status(200).json(convertGameListToJson(findAllGamesData));
    } catch (error) {
      next(error);
    }
  };

  // creates a new game
  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const createGameData: Game = await this.gameService.createGame(joinCode);

      res.status(201).json(gameToJson(createGameData));
    } catch (error) {
      next(error);
    }
  };

  // starts the specified game
  public startGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const updateGameData: Game = await this.gameService.startGame(joinCode);

      res.status(200).json(gameToJson(updateGameData));
    } catch (error) {
      next(error);
    }
  };

  // ends the specified game
  public endGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const endGameData: Game = await this.gameService.endGame(joinCode);

      res.status(200).json(gameToJson(endGameData));
    } catch (error) {
      next(error);
    }
  };

  // gets the leaderboard for the specified game
  public getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const updatedLeaderboardData: Game = await this.gameService.getLeaderboard(joinCode);

      res.status(200).json(gameToJson(updatedLeaderboardData));
    } catch (error) {
      next(error);
    }
  };

  // gets the current question from the game
  public getQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const question: Question = await this.gameService.getQuestion(joinCode);

      res.status(200).json(questionToJson(question));
    } catch (error) {
      next(error);
    }
  };

  // Change specific game to the next question
  public nextQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const game: Game = await this.gameService.nextQuestion(joinCode);

      res.status(200).json(gameToJson(game));
    } catch (error) {
      next(error);
    }
  };

  // gets a game by its join code
  public getGameByJoinCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const game: Game = await this.gameService.getGameByJoinCode(joinCode);

      res.status(200).json(gameToJson(game));
    } catch (error) {
      next(error);
    }
  };

  // gets players in a game
  public getPlayersInGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const players: Player[] = await this.gameService.getActivePlayers(joinCode);

      res.status(200).json(convertPlayerListToJson(players));
    } catch (error) {
      next(error);
    }
  };

  // Clear all
  public clearAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.gameService.clearAll();
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  // Sync the entire database
  public syncDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const syncData: SyncDatabaseDto = req.body;
      await this.gameService.syncDatabase(syncData);

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  // Request that server sends sync message to another database
  public requestSync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestSyncData: RequestSyncDto = req.body;
      const code = await this.gameService.requestSyncDatabase(requestSyncData);

      res.status(code).json();
    } catch (error) {
      next(error);
    }
  };
}

export default GamesController;
