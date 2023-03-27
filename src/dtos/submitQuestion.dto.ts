import { IsBoolean, IsNumber } from 'class-validator';

export class SubmitQuestionDto {
  @IsBoolean()
  public correctAnswer: boolean;
}
