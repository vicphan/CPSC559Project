import { receiveLatestUpdateFromOrigin } from '../utils/latestUpdates';
import { NextFunction, Request, Response } from 'express';

let myTimestamp = 0;

export const logicalTimestampMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const possibleReqTimestamp = req.header('lamportTimestamp');
  const incomingTimestamp = Number(possibleReqTimestamp) ?? 0;
  const maxTimestamp = Math.max(incomingTimestamp, myTimestamp);
  myTimestamp = maxTimestamp + 1;

  const originUrl = req.header('originUrl');
  if (originUrl && incomingTimestamp) {
    receiveLatestUpdateFromOrigin(originUrl, incomingTimestamp);
  }
  next();
};

export function getLamportTimestamp(): number {
  return myTimestamp;
}

export function incrementLamportTimestamp(): void {
  myTimestamp += 1;
}
