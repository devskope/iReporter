import { Record } from '../models/records';
import { User } from '../models/users';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

export default {
  fetchRecords(
    {
      params: { 0: recordType, 1: recordStatus },
      records,
      user: { id: userID },
    },
    res
  ) {
    const userRecords = records.filter(
      ({ created_by: creator }) => creator === userID
    );

    if (!recordType && !recordStatus) {
      return successResponse(res, userRecords);
    }

    if (!recordType && recordStatus) {
      const filteredRecords = userRecords.filter(
        ({ status }) => status === recordStatus
      );

      return filteredRecords.length > 0
        ? successResponse(res, filteredRecords)
        : handleError(res, `No records marked as ${recordStatus}.`, 404);
    }

    if (recordType && recordStatus) {
      const filteredRecords = userRecords.filter(
        ({ status, type }) => status === recordStatus && type === recordType
      );

      return filteredRecords.length > 0
        ? successResponse(res, filteredRecords)
        : handleError(
            res,
            `No ${recordType} records marked as ${recordStatus}.`,
            404
          );
    }

    return recordType
      ? successResponse(
          res,
          userRecords.filter(({ type }) => type === recordType)
        )
      : handleError(res, `No ${recordType} records found.`, 404);
  },

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

  getUsernameByID(
    {
      params: { id },
    },
    res
  ) {
    return User.getUsernameByID(id)
      .then(({ rows: [{ username }] }) =>
        successResponse(res, { username }, 200)
      )
      .catch(() => handleError(res, `Cannot find user with id ${id}.`, 404));
  },
};
