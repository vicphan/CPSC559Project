import { createQuestions } from '../utils/createQuestions';
import { NextFunction, Request, Response } from 'express';

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
}

export default IndexController;
