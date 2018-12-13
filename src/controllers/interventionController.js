import { Intervention } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

const createRecord = ({ body, user }, res) => {
  const { title, comment, location } = body;

  const newIntervention = new Intervention({
    title,
    comment,
    location,
    createdBy: user.id,
  });
  newIntervention.save().then(({ rows }) => {
    successResponse(
      res,
      { ...rows[0], message: `Created Intervention record` },
      201
    );
  });
};

const fetchAllRecords = (req, res) =>
  Intervention.getAll().then(({ rows }) =>
    rows.length > 0 ? successResponse(res, rows) : successResponse(res)
  );

const fetchRecordByID = ({ record }, res) => successResponse(res, record);

const updateComment = ({ body, editable, record, user }, res) => {
  if (
    editable &&
    record.comment !== body.comment &&
    record.created_by === user.id
  ) {
    Intervention.patch(record.id, body.comment, 'comment').then(({ id }) =>
      successResponse(res, {
        id,
        message: 'Updated intervention record’s comment',
        record: { ...record, ...{ comment: body.comment } },
      })
    );
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
    Intervention.patch(record.id, body.location, 'location').then(({ id }) =>
      successResponse(res, {
        id,
        message: 'Updated intervention record’s location',
        record: { ...record, ...{ location: body.location } },
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
    ? Intervention.patch(record.id, body.status, 'status').then(({ id }) =>
        successResponse(res, {
          id,
          message: 'Updated intervention record’s status',
          record: { ...record, ...{ status: body.status } },
        })
      )
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
  updateComment,
  updateLocation,
  updateStatus,
  deleteRecordByID,
};
