import { Router } from 'express';
import interventionController from '../controllers/interventionController';
import redFlagController from '../controllers/redFlagController';
import {
  checkRequired,
  strictRecordType,
  verifyRequestTypes,
} from '../middlewares/sanitizeRequest';
import loadRecordByID from '../middlewares/loadRecordByID';
import validUser from '../middlewares/validUser';

const router = new Router();

router.post(
  '/red-flags',
  validUser,
  checkRequired('record'),
  strictRecordType('red-flag'),
  verifyRequestTypes,
  redFlagController.createRecord
);
router.get('/red-flags', validUser, redFlagController.fetchAllRecords);
router.get(
  '/red-flags/:id',
  validUser,
  loadRecordByID('red-flag'),
  redFlagController.fetchRecordByID
);
router.patch(
  '/red-flags/:id/comment',
  validUser,
  checkRequired('comment'),
  verifyRequestTypes,
  loadRecordByID('red-flag'),
  redFlagController.updateComment
);
router.patch(
  '/red-flags/:id/location',
  validUser,
  checkRequired('location'),
  verifyRequestTypes,
  loadRecordByID('red-flag'),
  redFlagController.updateLocation
);
router.delete(
  '/red-flags/:id',
  validUser,
  loadRecordByID('red-flag'),
  redFlagController.deleteRecordByID
);

/* interventions */

router.post(
  '/interventions',
  validUser,
  checkRequired('record'),
  strictRecordType('intervention'),
  verifyRequestTypes,
  interventionController.createRecord
);

router.get('/interventions', validUser, interventionController.fetchAllRecords);

router.get(
  '/interventions/:id',
  validUser,
  loadRecordByID('intervention'),
  interventionController.fetchRecordByID
);

router.patch(
  '/interventions/:id/comment',
  validUser,
  checkRequired('comment'),
  verifyRequestTypes,
  loadRecordByID('intervention'),
  interventionController.updateComment
);

router.patch(
  '/interventions/:id/location',
  validUser,
  checkRequired('location'),
  verifyRequestTypes,
  loadRecordByID('intervention'),
  interventionController.updateLocation
);

router.delete(
  '/interventions/:id',
  validUser,
  loadRecordByID('intervention'),
  redFlagController.deleteRecordByID
);

export default router;
