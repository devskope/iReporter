import { Router } from 'express';
import interventionController from '../controllers/interventionController';
import redFlagController from '../controllers/redFlagController';
import {
  checkRequired,
  strictRecordType,
  verifyRequestTypes,
} from '../middlewares/sanitizeRequest';
import loadRecordByID from '../middlewares/loadRecordByID';

const router = new Router();

router.post(
  '/red-flags',
  checkRequired('record'),
  strictRecordType('red-flag'),
  verifyRequestTypes,
  redFlagController.createRecord
);
router.get('/red-flags', redFlagController.fetchAllRecords);
router.get(
  '/red-flags/:id',
  loadRecordByID('red-flag'),
  redFlagController.fetchRecordByID
);
router.patch(
  '/red-flags/:id/comment',
  checkRequired('comment'),
  loadRecordByID('red-flag'),
  verifyRequestTypes,
  redFlagController.updateComment
);
router.patch(
  '/red-flags/:id/location',
  checkRequired('location'),
  loadRecordByID('red-flag'),
  verifyRequestTypes,
  redFlagController.updateLocation
);
router.delete(
  '/red-flags/:id',
  loadRecordByID('red-flag'),
  redFlagController.deleteRecordByID
);

/* interventions */

router.post(
  '/interventions',
  checkRequired('record'),
  strictRecordType('intervention'),
  verifyRequestTypes,
  interventionController.createRecord
);

router.get('/interventions', interventionController.fetchAllRecords);

router.get(
  '/interventions/:id',
  loadRecordByID('intervention'),
  interventionController.fetchRecordByID
);

router.patch(
  '/interventions/:id/comment',
  checkRequired('comment'),
  loadRecordByID('intervention'),
  verifyRequestTypes,
  interventionController.updateComment
);

router.patch(
  '/interventions/:id/location',
  checkRequired('location'),
  loadRecordByID('intervention'),
  verifyRequestTypes,
  interventionController.updateLocation
);

export default router;
