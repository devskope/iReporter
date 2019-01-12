import { Router } from 'express';
import userController from '../controllers/userController';
import validUser from '../middlewares/validUser';

const router = new Router();

router.get('/user/recordstats', validUser, userController.fetchStats);
router.get('/user/id2name/:id', validUser, userController.getUsernameByID);

export default router;
