import express from 'express';
import debug from 'debug';
import env from './config/envConf';

const app = express();
const logger = debug('iReporter::server:');
const { PORT } = env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => logger(`started api server on ${PORT}`));

export default app;
