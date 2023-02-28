import { NextFunction, Request, Response } from 'express';
import { Game } from '@interfaces/games.interface';
import gameService from '@services/game.service';

class GamesController {
  public gameService = new gameService();

  public getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.gameService.findAllGames();

      res.status(200).json({ data: findAllGamesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createGameData: Game = await this.gameService.createGame();

      res.status(201).json({ data: createGameData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default GamesController;
