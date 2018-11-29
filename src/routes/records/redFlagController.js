import { RedFlag } from '../../models/records';
import successResponse from '../../helpers/successResponse';

const createRecord = (req, res) => {
  const { title, comment, location } = req.body;

  const newRedFlag = new RedFlag({ title, comment, location });
  newRedFlag
    .save()
    .then(({ id }) =>
      successResponse(res, { id, message: `Created red-flag record` }, 201)
    );
};

export default { createRecord };
