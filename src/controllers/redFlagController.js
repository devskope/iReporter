import { RedFlag } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

const createRecord = (req, res) => {
  const { title, comment, location } = req.body;

  const newRedFlag = new RedFlag({ title, comment, location });
  newRedFlag.save().then(({ rows }) => {
    successResponse(
      res,
      { ...rows[0], message: `Created red-flag record` },
      201
    );
  });
};

const fetchAllRecords = (req, res) =>
  RedFlag.getAll().then(({ rows }) =>
    rows.length > 0 ? successResponse(res, rows) : successResponse(res)
  );

const fetchRecordByID = ({ record }, res) => successResponse(res, record);

const updateComment = ({ body, editable, record }, res) => {
  if (editable && record.comment !== body.comment) {
    RedFlag.patch(record.id, body.comment, 'comment').then(({ id }) =>
      successResponse(res, {
        id,
        message: 'Updated red-flag record’s comment',
        record: { ...record, ...{ comment: body.comment } },
      })
    );
  } else if (!editable) {
    handleError(
      res,
      `Cannot change comment of red-flag record marked as "${record.status}"`,
      403
    );
  } else {
    successResponse(res, {}, 304);
  }
};

const updateLocation = ({ body, editable, record }, res) => {
  if (editable && record.location !== body.location) {
    RedFlag.patch(record.id, body.location, 'location').then(({ id }) =>
      successResponse(res, {
        id,
        message: 'Updated red-flag record’s location',
        record: { ...record, ...{ location: body.location } },
      })
    );
  } else if (!editable) {
    handleError(
      res,
      `Cannot change location of red-flag record marked as "${record.status}"`,
      403
    );
  } else {
    successResponse(res, {}, 304);
  }
};

const updateStatus = ({ body, record }, res) =>
  record.status !== body.status
    ? RedFlag.patch(record.id, body.status, 'status').then(({ id }) =>
        successResponse(res, {
          id,
          message: 'Updated red-flag record’s status',
          record: { ...record, ...{ status: body.status } },
        })
      )
    : successResponse(res, {}, 304);

const deleteRecordByID = ({ editable, record }, res) =>
  editable
    ? RedFlag.delete(record.id).then(() =>
        successResponse(res, {
          id: record.id,
          message: 'Red-flag record has been deleted',
        })
      )
    : handleError(
        res,
        `Cannot delete red-flag record marked as "${record.status}"`,
        403
      );

export default {
  createRecord,
  fetchAllRecords,
  fetchRecordByID,
  updateComment,
  updateLocation,
  updateStatus,
  deleteRecordByID,
};
