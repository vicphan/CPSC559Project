import { IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  public name: string;

  @IsString()
  public joinCode: string;
}