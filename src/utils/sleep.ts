import { setTimeout } from 'timers/promises';

export async function sleep(timeMs: number): Promise<void> {
  await setTimeout(timeMs);
}
