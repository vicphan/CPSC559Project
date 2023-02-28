import { NextFunction, Request, Response } from 'express';
import { Player } from '@interfaces/players.interface';
import playerService from '@services/player.service';
import { CreatePlayerDto } from '@dtos/players.dto';
import { SubmitQuestionDto } from '@/dtos/submitQuestion.dto';

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
      const playerData: CreatePlayerDto = req.body;
      const createPlayerData: Player = await this.playerService.createPlayer(playerData);

      res.status(201).json({ data: createPlayerData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerId: string = req.params.id;
      const answerData: SubmitQuestionDto = req.body;
      const createPlayerData: Player = await this.playerService.submitAnswer(playerId, answerData);

      res.status(200).json({ data: createPlayerData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default PlayersController;
