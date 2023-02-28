import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import GamesRoute from '@routes/games.route';
import PlayersRoute from '@routes/players.route';
import validateEnv from '@utils/validateEnv';
import questionModel from '@models/question.model';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new GamesRoute(), new PlayersRoute()]);

const { readFileSync } = require('fs');
const data = readFileSync('./questions.json');
const questionList = JSON.parse(data);
for (var i =0; i < questionList["questions"].length; i++)
{
    questionModel.create({ 
        prompt: questionList["questions"][i]["question"], 
        correctAnswerIndex: questionList["questions"][i]["correctIndex"], 
        answers: questionList["questions"][i]["answers"] });
}


app.listen();
