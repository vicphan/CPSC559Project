import { IsBoolean } from 'class-validator';

export class SubmitQuestionDto {
  @IsBoolean()
  public correctAnswer: number;
}
