import { Router } from 'express';
import GameController from '@controllers/game.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class GamesRoute implements Routes {
  public path = '/games';
  public router = Router();
  public gamesController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.gamesController.getGames);
  }
}

export default GamesRoute;
