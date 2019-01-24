import { RedFlag } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';
import mailHelper from '../helpers/mailHelper';

const createRecord = ({ body, files, protocol, hostname, user }, res) =>
  new RedFlag({
    ...body,
    createdBy: user.id,
    images: files
      ? files
          .filter(file => file.mimetype.startsWith('image'))
          .reduce(
            (paths, curr) => [
              ...paths,
              `${protocol}://${hostname}/${curr.path}`,
            ],
            []
          )
      : undefined,
    videos: files
      ? files
          .filter(file => file.mimetype.startsWith('video'))
          .reduce(
            (paths, curr) => [
              ...paths,
              `${protocol}://${hostname}/${curr.path}`,
            ],
            []
          )
      : undefined,
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

const toggleEmailNotifications = ({ body, record, user }, res) => {
  if (
    record.email_notify !== body.emailNotify &&
    record.created_by === user.id
  ) {
    RedFlag.patch(record.id, body.emailNotify, 'email_notify').then(
      ({ rows: [patchedRecord] }) => {
        successResponse(res, {
          id: patchedRecord.id,
          message: `Email notifications turned ${
            patchedRecord.email_notify ? 'on' : 'off'
          } for Red-Flag #${patchedRecord.id}`,
          patchedRecord,
        });
      }
    );
  } else if (record.created_by !== user.id) {
    handleError(
      res,
      `Cannot toggle Email notifications of red-flag record you did not create`,
      403
    );
  } else {
    successResponse(res, {}, 304);
  }
};

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
        mailHelper.statusNotify(rows[0]);
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
  toggleEmailNotifications,
  updateComment,
  updateLocation,
  updateStatus,
  deleteRecordByID,
};
