import { Record } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

export default {
  fetchStats(
    {
      user: { id: userID },
    },
    res
  ) {
    return Record.getAll().then(({ rowCount, rows: records }) => {
      if (rowCount > 0) {
        const userRecords = records.filter(
          ({ created_by: creator }) => creator === userID
        );

        if (userRecords.length > 0) {
          successResponse(
            res,
            userRecords.reduce(
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
          );
        } else handleError(res, 'No records found for user', 404);
      } else handleError(res, 'No records found', 404);
    });
  },
};
