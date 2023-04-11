const latestUpdates = new Map<string, number>();

export function receiveLatestUpdateFromOrigin(originUrl: string, updateTimestamp: number): void {
  latestUpdates.set(originUrl, updateTimestamp);
}

export function deleteOriginUrlFromUpdateTracker(originUrl: string): void {
  latestUpdates.delete(originUrl);
}

export function clearLatestUpdateTracker(): void {
  console.log('Clearing latest updates:');
  console.log(latestUpdates);
  latestUpdates.clear();
}

export function isEarlierThanEachOriginsLatestUpdate(timestamp: number): boolean {
  const values = latestUpdates.values();
  for (const val of values) {
    if (val < timestamp) return false;
  }
  return true;
}
