import { Router } from 'express';
import redFlagController from './redFlagController';
import strictRecordType from '../../middlewares/records/strictRecordType';
import {
  checkRequired,
  verifyRequestTypes,
} from '../../middlewares/sanitizeRequest';
import loadOneByID from '../../middlewares/records/loadOneByID';

const router = new Router();

router.post(
  '/red-flags',
  checkRequired('record'),
  strictRecordType('red-flag'),
  verifyRequestTypes('record'),
  redFlagController.createRecord
);
router.get('/red-flags', redFlagController.fetchAllRecords);
router.get(
  '/red-flags/:id',
  loadOneByID({ what: 'red-flag' }),
  redFlagController.fetchRecordByID
);
router.patch(
  '/red-flags/:id/comment',
  checkRequired('comment'),
  loadOneByID({ what: 'red-flag' }),
  verifyRequestTypes('record'),
  redFlagController.updateComment
);
router.patch(
  '/red-flags/:id/location',
  checkRequired('location'),
  loadOneByID({ what: 'red-flag' }),
  verifyRequestTypes('record'),
  redFlagController.updateLocation
);
router.delete(
  '/red-flags/:id',
  loadOneByID({ what: 'red-flag' }),
  redFlagController.deleteRecordByID
);

export default router;
