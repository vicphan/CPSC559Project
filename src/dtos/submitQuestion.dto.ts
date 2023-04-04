import { IsNumber } from 'class-validator';

export class SubmitQuestionDto {
  @IsNumber()
  public correctAnswer: number;
}
