import { Router } from 'express';
import PlayerController from '@controllers/player.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreatePlayerDto } from '@dtos/players.dto';

class PlayersRoute implements Routes {
  public path = '/players';
  public router = Router();
  public playersController = new PlayerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.playersController.getPlayers);
    this.router.post(`${this.path}`, validationMiddleware(CreatePlayerDto, 'body'), this.playersController.createPlayer);
  }
}

export default PlayersRoute;