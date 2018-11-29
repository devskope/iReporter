import express from 'express';
import debug from 'debug';
import morgan from 'morgan';
import env from './config/envConf';
import routes from './routes/index';

const app = express();
const logger = debug('iReporter::server:');
const { PORT } = env;

if (env.NODE_ENV === `production`) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(PORT, () => logger(`started api server on ${PORT}`));

export default app;
