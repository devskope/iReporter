import { RedFlag } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';
import mailHelper from '../helpers/mailHelper';

const createRecord = ({ body, user }, res) =>
  new RedFlag({
    ...body,
    ...{
      createdBy: user.id,
      emailNotify: body.emailNotify || user.emailNotify,
    },
  })
    .save()
    .then(({ rows }) =>
      successResponse(
        res,
        {
          id: rows[0].id,
          message: `Created red-flag record`,
        },
        201
      )
    );

const fetchAllRecords = (req, res) =>
  RedFlag.getAll().then(({ rowCount, rows: records }) =>
    rowCount > 0 ? successResponse(res, records) : successResponse(res)
  );

const fetchRecordByID = ({ record }, res) => successResponse(res, record);

const updateComment = ({ body, editable, record, user }, res) => {
  if (
    editable &&
    record.comment !== body.comment &&
    record.created_by === user.id
  ) {
    RedFlag.patch(record.id, body.comment, 'comment').then(({ rows }) =>
      successResponse(res, {
        id: rows[0].id,
        message: 'Updated red-flag record’s comment',
        record: rows[0],
      })
    );
  } else if (editable && record.created_by !== user.id) {
    handleError(
      res,
      `Cannot change comment of red-flag record you did not create`,
      403
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

const updateLocation = ({ body, editable, record, user }, res) => {
  if (
    editable &&
    record.location !== body.location &&
    record.created_by === user.id
  ) {
    RedFlag.patch(record.id, body.location, 'location').then(({ rows }) =>
      successResponse(res, {
        id: rows[0].id,
        message: 'Updated red-flag record’s location',
        record: rows[0],
      })
    );
  } else if (editable && record.created_by !== user.id) {
    handleError(
      res,
      `Cannot change location of red-flag record you did not create`,
      403
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
    ? RedFlag.patch(record.id, body.status, 'status').then(({ rows }) => {
        successResponse(res, {
          id: rows[0].id,
          message: 'Updated red-flag record’s status',
          record: rows[0],
        });
        mailHelper.statusNotify(rows[0]).then(x => console.log(x));
      })
    : successResponse(res, {}, 304);

const deleteRecordByID = ({ editable, record, user }, res) => {
  if (editable && record.created_by === user.id) {
    RedFlag.delete(record.id).then(() =>
      successResponse(res, {
        id: record.id,
        message: 'Red-flag record has been deleted',
      })
    );
  } else if (editable) {
    handleError(
      res,
      `Cannot delete a red-flag record you did not create"`,
      403
    );
  } else {
    handleError(
      res,
      `Cannot delete red-flag record marked as "${record.status}"`,
      403
    );
  }
};

export default {
  createRecord,
  fetchAllRecords,
  fetchRecordByID,
  updateComment,
  updateLocation,
  updateStatus,
  deleteRecordByID,
};
