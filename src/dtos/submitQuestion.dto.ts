import { IsInt, IsString } from 'class-validator';

export class SubmitQuestionDto {
  @IsString()
  public prompt: string;

  @IsInt()
  public answerIndex: number;
}
