import handleError, { missingFieldsMessage } from '../helpers/errorHelper';
import jsonParse from '../helpers/jsonParse';

export const validTypes = {
  title: String(),
  type: String(),
  comment: String(),
  status: ['under investigation', 'resolved', 'rejected', 'draft'],
  location: String(),
  password: String(),
};

export const checkRequired = checkWhat => (req, res, next) => {
  const { body } = req;
  const missingFields = [];

  switch (checkWhat) {
    case 'comment':
      if (!body.comment) missingFields.push('comment');
      break;
    case 'location':
      if (!body.location) missingFields.push('location');
      break;
    case 'record':
      missingFields.push(
        ...['type', 'title', 'comment'].filter(
          param => body[param] === undefined
        )
      );
      break;
    case 'user':
      missingFields.push(
        ...['email', 'username', 'password', 'firstname', 'lastname'].filter(
          param => body[param] === undefined
        )
      );
      break;
    /* istanbul ignore next */
    default:
      break;
  }

  return missingFields.length > 0
    ? handleError(res, missingFieldsMessage(missingFields), 400)
    : next();
};

export const strictRecordType = type => (req, res, next) => {
  const { body } = req;

  switch (type) {
    case 'red-flag':
      if (body.type !== type) {
        handleError(res, 'invalid record type', 400);
      } else {
        next();
      }

      break;
    /* istanbul ignore next */
    default:
      break;
  }
};

export const verifyRequestTypes = (req, res, next) => {
  const { body } = req;
  const errors = [];
  let long;
  let lat;

  const isEmpty = stringParam => stringParam === '';

  Object.keys(body).forEach(param => {
    if (body[param] !== undefined && typeof body[param] === 'string') {
      body[param] = body[param].trim();
      switch (param) {
        case 'email':
          if (isEmpty(body[param]) || !/^.+@.+\..+$/.test(body[param])) {
            errors.push(`cannot parse invalid email "${body[param]}".`);
          }

          break;
        case 'status':
          if (
            isEmpty(body[param]) ||
            !validTypes.status.includes(body[param])
          ) {
            errors.push(`cannot parse invalid status "${body[param]}".`);
          }

          break;
        case 'location':
          if (isEmpty(body[param])) {
            errors.push(
              `cannot parse invalid Location "${
                body[param]
              }" - location must be a comma separated string of numeric latitude and longitude coodinates.`
            );
          } else {
            [long, lat] = body[param].split(',');
            if (
              typeof long === 'undefined' ||
              typeof jsonParse(long.trim()) !== 'number' ||
              (typeof lat === 'undefined' ||
                typeof jsonParse(lat.trim()) !== 'number')
            ) {
              errors.push(
                `cannot parse invalid Location "${
                  body[param]
                }" - location must be a comma separated string of numeric longitude and latitude`
              );
            }
          }

          break;
        default:
          if (isEmpty(body[param])) {
            errors.push(
              `invalid ${param} - ${param} should be a valid non-empty ${typeof validTypes[
                param
              ]}.`
            );
          }
          break;
      }
    }
  });

  return errors.length > 0 ? handleError(res, errors, 422) : next();
};
