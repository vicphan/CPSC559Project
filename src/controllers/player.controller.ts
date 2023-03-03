import { NextFunction, Request, Response } from 'express';
import { Player } from '../interfaces/players.interface';
import playerService from '../services/player.service';
import { CreatePlayerDto } from '../dtos/players.dto';
import { SubmitQuestionDto } from '../dtos/submitQuestion.dto';

class PlayersController {
  public playerService = new playerService();

  // gets all players from all games
  public getPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPlayersData: Player[] = await this.playerService.findAllPlayers();

      res.status(200).json(findAllPlayersData);
    } catch (error) {
      next(error);
    }
  };

  // creates a new player when they join a game
  public createPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerData: CreatePlayerDto = req.body;
      const createPlayerData: Player = await this.playerService.createPlayer(playerData);

      res.status(201).json(createPlayerData);
    } catch (error) {
      next(error);
    }
  };

  public submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerId: string = req.params.id;
      const answerData: SubmitQuestionDto = req.body;
      const updatedPlayerData: Player = await this.playerService.submitAnswer(playerId, answerData);

      res.status(200).json(updatedPlayerData);
    } catch (error) {
      next(error);
    }
  };
}

export default PlayersController;
