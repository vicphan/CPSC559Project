import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import GamesRoute from './routes/games.route';
import PlayersRoute from './routes/players.route';
import questionModel from './models/question.model';
import App from './app';
import { createQuestions } from './createQuestions';

// validateEnv();
// createQuestions();
const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new GamesRoute(), new PlayersRoute()]);
createQuestions();

app.listen();
