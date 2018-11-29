import handleError from '../../helpers/errorHelper';

export default type => (req, res, next) => {
  const { body } = req;

  switch (type) {
    case 'red-flag':
      if (body.type !== type) {
        handleError(res, 'invalid record type', 400);
      } else {
        next();
      }

      break;
    default:
      break;
  }
};
