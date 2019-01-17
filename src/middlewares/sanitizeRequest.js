import handleError, { missingFieldsMessage } from '../helpers/errorHelper';
import jsonParse from '../helpers/jsonParse';

export const validTypes = {
  title: String(),
  type: String(),
  comment: String(),
  status: ['under investigation', 'resolved', 'rejected', 'draft'],
  location: String(),
  firstname: String(),
  lastname: String(),
  username: String(),
  password: String(),
  phone: Number(),
  emailNotify: Boolean(),
};

export const checkRequired = paramToCheck => (req, res, next) => {
  const { body } = req;
  const missingFields = [];

  const errorIfMissing = fieldNameArray => {
    missingFields.push(
      ...fieldNameArray.filter(
        field => body[field] === undefined || body[field] === null
      )
    );
  };

  switch (paramToCheck) {
    case 'comment':
    case 'location':
    case 'status':
    case 'emailNotify':
      errorIfMissing([paramToCheck]);
      break;
    case 'record':
      errorIfMissing(['type', 'title', 'comment']);
      break;
    case 'user':
      errorIfMissing([
        'email',
        'username',
        'password',
        'firstname',
        'lastname',
      ]);
      break;
    case 'login':
      errorIfMissing(['username', 'password']);
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
    case 'intervention':
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
    if (
      body[param] !== undefined &&
      (typeof body[param] === 'string' || typeof body[param] === 'boolean')
    ) {
      body[param] =
        typeof body[param] === 'string' ? body[param].trim() : body[param];

      switch (param) {
        case 'email':
          if (isEmpty(body[param]) || !/^.+@.+\..+$/.test(body[param])) {
            errors.push(`cannot parse invalid email "${body[param]}".`);
          }
          break;
        case 'emailNotify':
          if (
            isEmpty(body[param]) ||
            typeof jsonParse(body[param]) !== typeof validTypes[param]
          ) {
            errors.push(
              `Invalid value for ${param}: Expected ${typeof validTypes[param]}`
            );
          } else body[param] = JSON.parse(body[param]);
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
          [long, lat] = body[param].split(',');
          if (
            isEmpty(body[param]) ||
            (typeof long === 'undefined' ||
              typeof jsonParse(long.trim()) !== 'number' ||
              jsonParse(long.trim()) < -180 ||
              jsonParse(long.trim()) > 180) ||
            (typeof lat === 'undefined' ||
              typeof jsonParse(lat.trim()) !== 'number' ||
              jsonParse(lat.trim()) < -90 ||
              jsonParse(lat.trim()) > 90)
          ) {
            errors.push(
              `cannot parse invalid Location "${
                body[param]
              }" - location must be a valid comma separated string of numeric longitude and latitude coordinates.`
            );
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
    } else {
      errors.push(
        `invalid ${param} - ${param} should be a valid non-empty ${typeof validTypes[
          param
        ]}.`
      );
    }
  });

  return errors.length > 0 ? handleError(res, errors, 422) : next();
};
