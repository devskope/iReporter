import { Record } from '../models/records';
import jsonParse from '../helpers/jsonParse';
import handleError from '../helpers/errorHelper';

export default (req, res, next) => {
  const { id } = req.params;

  Record.getOneByID(jsonParse(id)).then(record =>
    record
      ? (() => {
          req.record = record;
          next();
        })()
      : handleError(res, `No order found with id '${id}'`, 404)
  );
};
