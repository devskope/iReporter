import { Router } from 'express';
import authController from '../controllers/authController';
import {
  checkRequired,
  verifyRequestTypes,
} from '../middlewares/sanitizeRequest';
import findByUsername from '../middlewares/findByUsername';

const router = new Router();

router.post(
  '/auth/signup',
  checkRequired('user'),
  verifyRequestTypes,
  findByUsername,
  authController.createUser
);

router.post(
  '/auth/login',
  checkRequired('login'),
  verifyRequestTypes,
  findByUsername,
  authController.loginUser
);

export default router;
