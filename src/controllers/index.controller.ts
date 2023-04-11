import { createQuestions } from '../utils/createQuestions';
import { NextFunction, Request, Response } from 'express';
import { clearLatestUpdateTracker, deleteOriginUrlFromUpdateTracker } from '../utils/latestUpdates';
import { clearPriorityQueue } from '@/utils/priorityQueue';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public resetQuestions = async (req: Request, res: Response, next: NextFunction) => {
    await createQuestions();
    res.status(200).send('Created questions');
  };

  public ping = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('pong');
  };

  public removeProxy = (req: Request, res: Response, next: NextFunction) => {
    const { urlToRemove } = req.body;
    if (!urlToRemove) {
      res.status(400).send("Expected parameter urlToRemove in request's json body");
      return;
    }
    deleteOriginUrlFromUpdateTracker(urlToRemove);
    res.status(200).send(`removed ${urlToRemove} if present`);
  };

  public clearAllTob = (req: Request, res: Response, next: NextFunction) => {
    clearLatestUpdateTracker();
    clearPriorityQueue();
    res.status(200).send(`cleared`);
  };
}

export default IndexController;
