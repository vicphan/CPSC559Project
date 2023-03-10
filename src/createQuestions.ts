import { getGameService } from './services/game.service';
import { readFileSync } from 'fs';
import questionModel from './models/question.model';
import { logger } from './utils/logger';

export async function createQuestions() {
  logger.info('Deleting existing questions and creating new ones from questions json..');
  const gameService = getGameService();
  await gameService.deleteQuestions();
  const data = readFileSync('./questions.json');
  const dataString = data.toString();
  const questionList = JSON.parse(dataString);
  for (let i = 0; i < questionList['questions'].length; i++) {
    questionModel.create({
      prompt: questionList['questions'][i]['question'],
      correctAnswerIndex: questionList['questions'][i]['correctIndex'],
      answers: questionList['questions'][i]['answers'],
      index: i,
    });
  }
}
