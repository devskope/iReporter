import { Router } from 'express';
import authController from '../controllers/authController';
import {
  checkRequired,
  verifyRequestTypes,
} from '../middlewares/sanitizeRequest';

const router = new Router();

router.post(
  '/auth/signup',
  checkRequired('user'),
  verifyRequestTypes,
  authController.createUser
);

export default router;
