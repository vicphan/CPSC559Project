import { NextFunction, Request, Response } from 'express';
import { Player, playerToJson, convertPlayerListToJson } from '../interfaces/players.interface';
import playerService from '../services/player.service';
import { CreatePlayerDto } from '../dtos/players.dto';
import { SubmitQuestionDto } from '../dtos/submitQuestion.dto';

class PlayersController {
  public playerService = new playerService();

  // gets all players from all games
  public getPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPlayersData: Player[] = await this.playerService.findAllPlayers();

      res.status(200).json(convertPlayerListToJson(findAllPlayersData));
    } catch (error) {
      next(error);
    }
  };

  // creates a new player to join a specific game
  public createPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerData: CreatePlayerDto = req.body;
      const createPlayerData: Player = await this.playerService.createPlayer(playerData);

      res.status(201).json(playerToJson(createPlayerData));
    } catch (error) {
      next(error);
    }
  };

  // Submit and answer to a question for a specific player
  public submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerName: string = req.params.name;
      const gameCode: string = req.params.joinCode;
      const answerData: SubmitQuestionDto = req.body;
      const updatedPlayerData: Player = await this.playerService.submitAnswer(playerName, gameCode, answerData);

      res.status(200).json(playerToJson(updatedPlayerData));
    } catch (error) {
      next(error);
    }
  };
}

export default PlayersController;
