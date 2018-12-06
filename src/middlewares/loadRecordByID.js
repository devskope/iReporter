import { Record } from '../models/records';
import jsonParse from '../helpers/jsonParse';
import handleError from '../helpers/errorHelper';

export default type => (req, res, next) => {
  const { id } = req.params;

  Record.getOneByID(jsonParse(id)).then(({ rows }) =>
    rows[0] && rows[0].type === type
      ? (() => {
          req.record = { ...rows[0] };
          next();
        })()
      : handleError(res, `No record exists with id '${id}'`, 404)
  );
};
