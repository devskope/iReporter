import { Record } from '../models/records';
import jsonParse from '../helpers/jsonParse';
import handleError from '../helpers/errorHelper';

export default type => (req, res, next) => {
  const { id } = req.params;
  return id > 2147483647
    ? handleError(res, `No record exists with id '${id}'`, 404)
    : Record.getOneByID(jsonParse(id)).then(({ rows }) =>
        rows[0] && rows[0].type === type
          ? (() => {
              if (
                !['under investigation', 'resolved', 'rejeted'].includes(
                  rows[0].status
                )
              ) {
                req.editable = true;
              }
              req.record = { ...rows[0] };
              next();
            })()
          : handleError(res, `No ${type} record exists with id '${id}'`, 404)
      );
};
