import { Record } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

export default {
  fetchStats(req, res) {
    Record.getAll().then(({ rowCount, rows: records }) =>
      rowCount > 0
        ? successResponse(
            res,
            records.reduce(
              (statCountObj, { status }) =>
                statCountObj[status]
                  ? Object.assign(statCountObj, {
                      [status]: statCountObj[status] + 1,
                    })
                  : Object.assign(statCountObj, {
                      [status]: 1,
                    }),
              {}
            ),
            200
          )
        : handleError(res, 'No records found', 404)
    );
  },
};
