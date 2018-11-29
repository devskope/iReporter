import recordRouter from './records/index';

const ROOT_URL = '/api/v1';

const router = app => {
  app.use(ROOT_URL, recordRouter);
};

export default router;
