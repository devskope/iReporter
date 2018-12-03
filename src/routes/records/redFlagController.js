import { RedFlag } from '../../models/records';
import successResponse from '../../helpers/successResponse';

const createRecord = (req, res) => {
  const { title, comment, location } = req.body;

  const newRedFlag = new RedFlag({ title, comment, location });
  newRedFlag
    .save()
    .then(({ id }) =>
      successResponse(res, { id, message: `Created red-flag record` }, 201)
    );
};

const fetchAllRecords = (req, res) => {
  RedFlag.getAll().then(redFlagRecords =>
    redFlagRecords.length > 0
      ? successResponse(res, redFlagRecords)
      : successResponse(res)
  );
};

const fetchRecordByID = ({ record }, res) => successResponse(res, record);

const updateComment = ({ body, record }, res) =>
  record.comment !== body.comment
    ? RedFlag.patch(record.id, body.comment, 'comment').then(({ id }) =>
        successResponse(res, {
          id,
          message: 'Updated red-flag record’s comment',
        })
      )
    : successResponse(res, {
        id: record.id,
        message: 'Comment unchanged, nothing to update',
      });

const updateLocation = ({ body, record }, res) =>
  record.location !== body.location
    ? RedFlag.patch(record.id, body.location, 'location').then(({ id }) =>
        successResponse(res, {
          id,
          message: 'Updated red-flag record’s location',
        })
      )
    : successResponse(res, {
        id: record.id,
        message: 'Location unchanged, nothing to update',
      });

const deleteRecordByID = ({ record }, res) =>
  RedFlag.delete(record.id).then(({ id }) =>
    successResponse(res, { id, message: 'red-flag record has been deleted' })
  );

export default {
  createRecord,
  fetchAllRecords,
  fetchRecordByID,
  updateComment,
  updateLocation,
  deleteRecordByID,
};
