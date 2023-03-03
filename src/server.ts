console.log('Helloeeeeeeeeee!');

import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import GamesRoute from './routes/games.route';
import PlayersRoute from './routes/players.route';
import validateEnv from './utils/validateEnv';
import questionModel from './models/question.model';

console.log('Grrr');
import App from './app';

async function createQuestions() {
  const modelCount = (await questionModel.find()).length;
  if (modelCount == 0) {
    const { readFileSync } = require('fs');
    const data = readFileSync('./questions.json');
    const questionList = JSON.parse(data);
    for (let i = 0; i < questionList['questions'].length; i++) {
      questionModel.create({
        prompt: questionList['questions'][i]['question'],
        correctAnswerIndex: questionList['questions'][i]['correctIndex'],
        answers: questionList['questions'][i]['answers'],
        index: i,
      });
    }
  }
}

console.log('Hello!');
// validateEnv();
console.log('Hi!');
const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new GamesRoute(), new PlayersRoute()]);
console.log('Apphole music');
createQuestions();

app.listen();
