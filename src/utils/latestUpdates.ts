const latestUpdates = new Map<string, number>();

export function receiveLatestUpdateFromOrigin(originUrl: string, updateTimestamp: number): void {
  latestUpdates.set(originUrl, updateTimestamp);
}

export function deleteOriginUrlFromUpdateTracker(originUrl: string): void {
  latestUpdates.delete(originUrl);
}

export function isEarlierThanEachOriginsLatestUpdate(timestamp: number): boolean {
  const values = latestUpdates.values();
  for (const val of values) {
    if (val < timestamp) return false;
  }
  return true;
}
