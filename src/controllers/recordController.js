import { Record } from '../models/records';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

export default {
  fetchRecords(
    {
      params: { 0: recordType, 1: recordStatus },
      records,
    },
    res
  ) {
    if (!recordType && !recordStatus) {
      return successResponse(res, records);
    }

    if (!recordType && recordStatus) {
      const filteredRecords = records.filter(
        ({ status }) => status === recordStatus
      );

      return filteredRecords.length > 0
        ? successResponse(res, filteredRecords)
        : handleError(res, `No records marked as ${recordStatus}.`, 404);
    }

    if (recordType && recordStatus) {
      const filteredRecords = records.filter(
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
      ? successResponse(res, records.filter(({ type }) => type === recordType))
      : handleError(res, `No ${recordType} records found.`, 404);
  },

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
