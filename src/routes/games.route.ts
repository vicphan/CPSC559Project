import { Router } from 'express';
import GameController from '../controllers/game.controller';
import { Routes } from '../interfaces/routes.interface';

class GamesRoute implements Routes {
  public path = '/games';
  public router = Router();
  public gamesController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.gamesController.getGames);
    this.router.get(`${this.path}/:joinCode`, this.gamesController.getGameByJoinCode);
    this.router.get(`${this.path}/leaderboard/:joinCode`, this.gamesController.getLeaderboard);
    this.router.get(`${this.path}/question/:joinCode`, this.gamesController.getQuestion);
    this.router.put(`${this.path}/question/:joinCode`, this.gamesController.nextQuestion);
    this.router.post(`${this.path}/:joinCode`, this.gamesController.createGame);
    this.router.put(`${this.path}/:joinCode`, this.gamesController.startGame);
    this.router.delete(`${this.path}/:joinCode`, this.gamesController.endGame);
  }
}

export default GamesRoute;
