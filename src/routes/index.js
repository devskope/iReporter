import recordRouter from './records';
import authRouter from './auth';
import userRouter from './user';
import apiSpec from '../../utils/swagger_spec.json';
import handleError from '../helpers/errorHelper';

const { serve, setup } = require('swagger-ui-express');

const ROOT_URL = '/api/v1';

const router = app => {
  app.use(ROOT_URL, recordRouter);
  app.use(ROOT_URL, authRouter);
  app.use(ROOT_URL, userRouter);
  app.use('/api-docs', serve, setup(apiSpec));
  app.use('*', (req, res) =>
    handleError(res, 'Requested resource not found.', 404)
  );
};

export default router;
