import { RedFlag } from '../../models/records';
import successResponse from '../../helpers/successResponse';
import handleError from '../../helpers/errorHelper';
import jsonParse from '../../helpers/jsonParse';

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
      ? successResponse(res, redFlagRecords, 200)
      : handleError(res, 'No red-flag records found', 404)
  );
};

const fetchRecordByID = (req, res) => {
  const { id } = req.params;
  RedFlag.getOneByID(jsonParse(id)).then(record =>
    record.length > 0
      ? successResponse(res, record)
      : handleError(res, `No order found with id '${id}'`, 404)
  );
};

export default { createRecord, fetchAllRecords, fetchRecordByID };
