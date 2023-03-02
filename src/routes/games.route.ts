import { Router } from 'express';
import GameController from '@controllers/game.controller';
import { Routes } from '@interfaces/routes.interface';

class GamesRoute implements Routes {
  public path = '/games';
  public router = Router();
  public gamesController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.gamesController.getGames);
    this.router.get(`${this.path}/:id`, this.gamesController.getGameByID);
    this.router.get(`${this.path}/leaderboard/:id`, this.gamesController.getLeaderboard);
    this.router.get(`${this.path}/question/:id`, this.gamesController.getQuestion);
    this.router.post(`${this.path}`, this.gamesController.createGame);
    this.router.put(`${this.path}/:id`, this.gamesController.startGame);
    this.router.delete(`${this.path}/:id`, this.gamesController.endGame);
  }
}

export default GamesRoute;