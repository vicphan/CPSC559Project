import { IsArray } from 'class-validator';
import { Game } from '@/interfaces/games.interface';

export class SyncDatabaseDto {
  @IsArray()
  public gameList: [Game];

  @IsArray()
  public playerList: [];
}
