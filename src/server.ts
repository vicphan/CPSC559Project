import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import GamesRoute from './routes/games.route';
import PlayersRoute from './routes/players.route';
import App from './app';

// validateEnv();
const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new GamesRoute(), new PlayersRoute()]);

app.listen();
