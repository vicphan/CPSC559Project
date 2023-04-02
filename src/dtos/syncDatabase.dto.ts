import { IsJSON } from 'class-validator';
import { JsonObject } from 'swagger-ui-express';

export class SyncDatabaseDto {
  @IsJSON()
  public games: JsonObject;

  @IsJSON()
  public players: JsonObject;
}
