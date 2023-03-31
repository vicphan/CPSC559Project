import { HttpException } from '../exceptions/HttpException';
import { isEarlierThanEachOriginsLatestUpdate } from '../utils/latestUpdates';
import { tobQueue } from '../utils/priorityQueue';
import { sleep } from '../utils/sleep';
import { NextFunction, Request, Response } from 'express';

const MAX_ATTEMPTS = 10;

export const totallyOrderedBroadcastMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const originUrl = req.header('originUrl');
  const incomingTimestamp = Number(req.header('lamportTimestamp'));
  const requestId = req.header('requestId');
  if (!req.header('tob') || !originUrl || !incomingTimestamp || !requestId) {
    next();
  }
  console.log('Applying tob middleware');
  tobQueue.push([requestId, incomingTimestamp, originUrl]);
  let attempts = 0;
  while (true) {
    const [headRequestId] = tobQueue.peek();
    console.log(`HeadReqId: ${headRequestId}`);
    if (headRequestId === requestId && isEarlierThanEachOriginsLatestUpdate(incomingTimestamp)) {
      break;
    }
    attempts += 1;
    if (attempts === MAX_ATTEMPTS) {
      next(new HttpException(555, 'Totally ordered broadcast waited too long'));
    }
    await sleep(100);
  }
  next();
};
