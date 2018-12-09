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

export default {
  createRecord,
  fetchAllRecords,
  fetchRecordByID,
};
