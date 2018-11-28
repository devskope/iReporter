import express from 'express';
import debug from 'debug';

const app = express();
const logger = debug('iReporter::server:');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => logger('started'));
