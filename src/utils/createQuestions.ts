import { getGameService } from '../services/game.service';
import questionModel from '../models/question.model';
import { logger } from './logger';
import { questions } from './questions';

export async function createQuestions() {
  logger.info('Deleting existing questions and creating new ones from questions json..');
  const gameService = getGameService();
  await gameService.deleteQuestions();
  for (let i = 0; i < questions.length; i++) {
    questionModel.create({
      prompt: questions[i]['question'],
      correctAnswerIndex: questions[i]['correctIndex'],
      answers: questions[i]['answers'],
      index: i,
    });
  }
}
