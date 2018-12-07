import recordRouter from './records';
import authRouter from './auth';

const ROOT_URL = '/api/v1';

const router = app => {
  app.use(ROOT_URL, recordRouter);
  app.use(ROOT_URL, authRouter);
};

export default router;
