import recordRouter from './records';

const ROOT_URL = '/api/v1';

const router = app => {
  app.use(ROOT_URL, recordRouter);
};

export default router;
