import recordRouter from './records';
import authRouter from './auth';
import apiSpec from '../../utils/swagger_spec.json';

const { serve, setup } = require('swagger-ui-express');

const ROOT_URL = '/api/v1';

const router = app => {
  app.use(ROOT_URL, recordRouter);
  app.use(ROOT_URL, authRouter);
  app.use('/api-docs', serve, setup(apiSpec));
};

export default router;
