import { Router } from 'express';
import redFlagController from './redFlagController';
import strictRecordType from '../../middlewares/records/strictRecordType';
import {
  checkRequired,
  verifyRequestTypes,
} from '../../middlewares/sanitizeRequest';

const router = new Router();

router.post(
  '/red-flags',
  checkRequired('record'),
  verifyRequestTypes('record'),
  strictRecordType('red-flag'),
  redFlagController.createRecord
);
router.get('/red-flags', redFlagController.fetchAllRecords);
router.get('/red-flags/:id', redFlagController.fetchRecordByID);

export default router;
