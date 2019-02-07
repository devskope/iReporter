import { Router } from 'express';
import userController from '../controllers/userController';
import validUser from '../middlewares/validUser';
import loadAllRecords from '../middlewares/loadAllRecords';

const router = new Router();

router.get('/user/recordstats', validUser, userController.fetchStats);
router.get('/user/id2name/:id', validUser, userController.getUsernameByID);
router.get(
  '/user/:id/profile',
  validUser,
  loadAllRecords,
  userController.getProfileByID
);
router.get(
  /^\/user\/(\d)?\/?records\/?(intervention|red-flag)?\/?(under%20investigation|resolved|rejected|draft)?\/?$/,
  validUser,
  loadAllRecords,
  userController.fetchRecords
);

export default router;
