import { IsArray, IsString } from 'class-validator';
import { Game } from '@/interfaces/games.interface';

export class SyncDatabaseDto {
  @IsArray()
  public gameList: [Game];

  @IsArray()
  public playerList: [];
}

export class RequestSyncDto {
  @IsString()
  public url: String;
}