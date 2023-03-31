import { NextFunction, Request, Response } from 'express';
import { Game, gameToJson, convertGameListToJson } from '../interfaces/games.interface';
import { getGameService } from '../services/game.service';
import { Question, questionToJson } from '../interfaces/questions.interface';
import { Player, convertPlayerListToJson, } from '../interfaces/players.interface';
import { SyncGameDto } from '../dtos/syncGame.dto';

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

  // Change to the next question
  public nextQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const game: Game = await this.gameService.nextQuestion(joinCode);

      res.status(200).json(gameToJson(game));
    } catch (error) {
      next(error);
    }
  };

  // gets a game by its game ID
  public getGameByJoinCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const game: Game = await this.gameService.getGameByJoinCode(joinCode);

      res.status(200).json(gameToJson(game));
    } catch (error) {
      next(error);
    }
  };

  // gets a game by its game ID
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

  // Sync the game
  public syncGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinCode: string = req.params.joinCode;
      const syncData: SyncGameDto = req.body;
      const syncedGame: Game = await this.gameService.syncGame(joinCode, syncData);

      res.status(200).json(syncedGame);
    } catch (error) {
      next(error);
    }
  };
}

export default GamesController;
