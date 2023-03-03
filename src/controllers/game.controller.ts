import { NextFunction, Request, Response } from 'express';
import { Game } from '../interfaces/games.interface';
import { getGameService } from '../services/game.service';
import { Question } from '../interfaces/questions.interface';

class GamesController {
  public gameService = getGameService();

  // gets all running games
  public getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.gameService.findAllGames();

      res.status(200).json(findAllGamesData);
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

      res.status(200).json(updateGameData);
    } catch (error) {
      next(error);
    }
  };

  // ends the specified game
  public endGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const endGameData: Game = await this.gameService.endGame(gameId);

      res.status(200).json(endGameData);
    } catch (error) {
      next(error);
    }
  };

  // gets the leaderboard for the specified game
  public getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const updatedLeaderboardData: Game = await this.gameService.getLeaderboard(gameId);

      res.status(200).json(updatedLeaderboardData);
    } catch (error) {
      next(error);
    }
  };

  // gets the current question from the game
  public getQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const question: Question = await this.gameService.getQuestion(gameId);

      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  };

  // Change to the next question
  public nextQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const game: Game = await this.gameService.nextQuestion(gameId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  };

  // gets a game by its game ID
  public getGameByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const game: Game = await this.gameService.getGameByID(gameId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  };
}

export default GamesController;
