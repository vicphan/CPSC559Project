import { IsJSON, IsNumber } from 'class-validator';
import { JsonObject } from 'swagger-ui-express';

export class SyncGameDto {
  @IsNumber()
  public questionIndex: number;

  @IsJSON()
  public playerScores: JsonObject;
}
