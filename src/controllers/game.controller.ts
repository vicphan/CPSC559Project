import { NextFunction, Request, Response } from 'express';
import { Game } from '@interfaces/games.interface';
import { getGameService } from '@/services/game.service';

class GamesController {
  public gameService = getGameService();

  // gets all running games
  public getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.gameService.findAllGames();

      res.status(200).json({ data: findAllGamesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  // creates a new game
  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createGameData: Game = await this.gameService.createGame();
      res.status(201).json(createGameData);
    } catch (error) {
      next(error);
    }
  };

  // starts the specified game
  public startGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const updateGameData: Game = await this.gameService.startGame(gameId);

      res.status(200).json({ data: updateGameData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  // ends the specified game
  public endGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const endGameData: Game = await this.gameService.endGame(gameId);

      res.status(200).json({ data: endGameData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  // gets the leaderboard for the specified game
  public getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const updatedLeaderboardData: Game = await this.gameService.getLeaderboard(gameId);

      res.status(200).json({ data: updatedLeaderboardData, message: 'updated leaderboard' });
    } catch (error) {
      next(error);
    }
  };

  // gets a game by its game ID
  public getGameByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const game: Game = await this.gameService.getGameByID(gameId);

      res.status(200).json({ data: game, message: 'got game with id ' + gameId });
    } catch (error) {
      next(error);
    }
  };
}

export default GamesController;
