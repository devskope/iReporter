import { Intervention } from '../models/records';
import successResponse from '../helpers/successResponse';

const createRecord = (req, res) => {
  const { title, comment, location } = req.body;

  const newIntervention = new Intervention({ title, comment, location });
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

const updateComment = ({ body, record }, res) =>
  record.comment !== body.comment
    ? Intervention.patch(record.id, body.comment, 'comment').then(({ id }) =>
        successResponse(res, {
          id,
          message: 'Updated intervention record’s comment',
        })
      )
    : successResponse(res, {
        id: record.id,
        message: 'Comment unchanged, nothing to update',
      });

const updateLocation = ({ body, record }, res) =>
  record.location !== body.location
    ? Intervention.patch(record.id, body.location, 'location').then(({ id }) =>
        successResponse(res, {
          id,
          message: 'Updated intervention record’s location',
        })
      )
    : successResponse(res, {
        id: record.id,
        message: 'Location unchanged, nothing to update',
      });

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

const deleteRecordByID = ({ record }, res) =>
  Intervention.delete(record.id).then(() =>
    successResponse(res, {
      id: record.id,
      message: 'intervention record has been deleted',
    })
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
