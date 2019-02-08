import { Record } from '../models/records';
import { User } from '../models/users';
import recordStats from '../helpers/recordStats';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

export default {
  async fetchRecords(
    {
      params: { 0: id, 1: recordType, 2: recordStatus },
      records,
      user,
    },
    res
  ) {
    let userRecords;
    if (id) {
      const { rowCount } = await User.findByID(id);

      if (!rowCount) {
        handleError(res, 'User not Found', 404);
        return;
      }
      userRecords = records.filter(
        ({ created_by: creator }) => creator === JSON.parse(id)
      );
    } else {
      userRecords = records.filter(
        ({ created_by: creator }) => creator === user.id
      );
    }
    if (!recordType && !recordStatus) {
      successResponse(res, userRecords);
      return;
    }

    if (!recordType && recordStatus) {
      const filteredRecords = userRecords.filter(
        ({ status }) => status === recordStatus
      );

      if (filteredRecords.length) {
        successResponse(res, filteredRecords);
        return;
      }
      handleError(res, `No records marked as ${recordStatus}.`, 404);
      return;
    }

    if (recordType && recordStatus) {
      const filteredRecords = userRecords.filter(
        ({ status, type }) => status === recordStatus && type === recordType
      );

      if (filteredRecords.length) {
        successResponse(res, filteredRecords);
        return;
      }
      handleError(
        res,
        `No ${recordType} records marked as ${recordStatus}.`,
        404
      );
      return;
    }
    if (recordType) {
      successResponse(
        res,
        userRecords.filter(({ type }) => type === recordType)
      );
    } else handleError(res, `No ${recordType} records found.`, 404);
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
          successResponse(res, recordStats(userRecords), 200);
        } else handleError(res, 'No records found for user', 404);
      } else handleError(res, 'No records found', 404);
    });
  },

  async getProfileByID(
    {
      params: { id },
      records,
    },
    res
  ) {
    const profile = {};
    const userRecords = records.filter(
      ({ created_by: creator }) => creator === JSON.parse(id)
    );

    try {
      ({
        rows: [
          {
            username: profile.username,
            email: profile.email,
            registered: profile.registered,
            id: profile.id,
            firstname: profile.firstname,
            lastname: profile.lastname,
          },
        ],
      } = await User.findByID(id));
      profile.registered = new Date(profile.registered).toLocaleDateString(
        'en-GB',
        { hour: '2-digit', minute: '2-digit' }
      );
      profile.recordCount = userRecords.length;
      profile.recordStats = recordStats(userRecords);
      successResponse(res, { profile });
    } catch (error) {
      handleError(res, 'User not Found', 404);
    }
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
