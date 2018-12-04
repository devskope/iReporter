import { Router } from 'express';
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
router.get('/red-flags/:id', loadRecordByID, redFlagController.fetchRecordByID);
router.patch(
  '/red-flags/:id/comment',
  checkRequired('comment'),
  loadRecordByID,
  verifyRequestTypes,
  redFlagController.updateComment
);
router.patch(
  '/red-flags/:id/location',
  checkRequired('location'),
  loadRecordByID,
  verifyRequestTypes,
  redFlagController.updateLocation
);
router.delete(
  '/red-flags/:id',
  loadRecordByID,
  redFlagController.deleteRecordByID
);

export default router;
