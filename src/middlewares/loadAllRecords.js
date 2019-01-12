import { Record } from '../models/records';
import handleError from '../helpers/errorHelper';

export default (req, res, next) =>
  Record.getAll().then(({ rowCount, rows: records }) => {
    if (rowCount > 1) {
      req.records = records;
      next();
    } else {
      handleError(res, 'No records created yet', 404);
    }
  });
