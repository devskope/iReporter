import { RedFlag } from '../../models/records';
import jsonParse from '../../helpers/jsonParse';
import handleError from '../../helpers/errorHelper';

export default ({ what }) => (req, res, next) => {
  const { id } = req.params;
  switch (what) {
    case 'red-flag':
      RedFlag.getOneByID(jsonParse(id)).then(record =>
        record
          ? (() => {
              req.record = record;
              next();
            })()
          : handleError(res, `No order found with id '${id}'`, 404)
      );
      break;

    default:
      break;
  }
};
