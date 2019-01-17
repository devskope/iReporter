import { Intervention } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';
import mailHelper from '../helpers/mailHelper';

const createRecord = ({ body, user }, res) =>
  new Intervention({
    ...body,
    ...{ createdBy: user.id },
  })
    .save()
    .then(({ rows }) =>
      successResponse(
        res,
        {
          id: rows[0].id,
          message: `Created Intervention record`,
        },
        201
      )
    );

const fetchAllRecords = (req, res) =>
  Intervention.getAll().then(({ rowCount, rows: records }) =>
    rowCount > 0 ? successResponse(res, records) : successResponse(res)
  );

const fetchRecordByID = ({ record }, res) => successResponse(res, record);

const toggleEmailNotifications = ({ body, record, user }, res) => {
  if (
    record.email_notify !== body.emailNotify &&
    record.created_by === user.id
  ) {
    Intervention.patch(record.id, body.emailNotify, 'email_notify').then(
      ({ rows: [patchedRecord] }) => {
        successResponse(res, {
          id: patchedRecord.id,
          message: `Email notifications turned ${
            patchedRecord.email_notify ? 'on' : 'off'
          } for Intervention #${patchedRecord.id}`,
          patchedRecord,
        });
      }
    );
  } else if (record.created_by !== user.id) {
    handleError(
      res,
      `Cannot toggle Email notifications of intervention record you did not create`,
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
    Intervention.patch(record.id, body.comment, 'comment').then(({ rows }) => {
      successResponse(res, {
        id: rows[0].id,
        message: 'Updated intervention record’s comment',
        record: rows[0],
      });
    });
  } else if (editable && record.created_by !== user.id) {
    handleError(
      res,
      `Cannot change comment of intervention record you did not create`,
      403
    );
  } else if (!editable) {
    handleError(
      res,
      `Cannot change comment of intervention record marked as "${
        record.status
      }"`,
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
    Intervention.patch(record.id, body.location, 'location').then(({ rows }) =>
      successResponse(res, {
        id: rows[0].id,
        message: 'Updated intervention record’s location',
        record: rows[0],
      })
    );
  } else if (editable && record.created_by !== user.id) {
    handleError(
      res,
      `Cannot change location of intervention record you did not create`,
      403
    );
  } else if (!editable) {
    handleError(
      res,
      `Cannot change location of intervention record marked as "${
        record.status
      }"`,
      403
    );
  } else {
    successResponse(res, {}, 304);
  }
};

const updateStatus = ({ body, record }, res) =>
  record.status !== body.status
    ? Intervention.patch(record.id, body.status, 'status').then(({ rows }) => {
        successResponse(res, {
          id: rows[0].id,
          message: 'Updated intervention record’s status',
          record: rows[0],
        });
        mailHelper.statusNotify(rows[0]);
      })
    : successResponse(res, {}, 304);

const deleteRecordByID = ({ editable, record, user }, res) => {
  if (editable && record.created_by === user.id) {
    Intervention.delete(record.id).then(() =>
      successResponse(res, {
        id: record.id,
        message: 'Intervention record has been deleted',
      })
    );
  } else if (editable) {
    handleError(
      res,
      `Cannot delete an intervention record you did not create"`,
      403
    );
  } else {
    handleError(
      res,
      `Cannot delete intervention record marked as "${record.status}"`,
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
