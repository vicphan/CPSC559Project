import { NextFunction, Request, Response } from 'express';
import { Player } from '@interfaces/players.interface';
import playerService from '@services/player.service';

class PlayersController {
  public playerService = new playerService();

  public getPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPlayersData: Player[] = await this.playerService.findAllPlayers();

      res.status(200).json({ data: findAllPlayersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createPlayerData: Player = await this.playerService.createPlayer();

      res.status(201).json({ data: createPlayerData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default PlayersController;
