import handleError, { missingFieldsMessage } from '../helpers/errorHelper';
import jsonParse from '../helpers/jsonParse';

export const validTypes = {
  title: String(),
  type: String(),
  comment: String(),
  status: ['under investigation', 'resolved', 'rejected', 'draft'],
  location: String(),
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
    default:
      break;
  }

  if (missingFields.length > 0) {
    return handleError(res, missingFieldsMessage(missingFields), 400);
  }
  return next();
};

export const verifyRequestTypes = verifyWhat => (req, res, next) => {
  const { title, type, comment, status, location } = req.body;
  const recordRequestParams = { title, type, comment, status, location };
  const errors = [];
  let long;
  let lat;

  if (verifyWhat === 'record') {
    Object.keys(recordRequestParams).forEach(param => {
      switch (param) {
        case 'status':
          if (recordRequestParams[param] === undefined || null) {
            break;
          }

          if (
            typeof recordRequestParams[param] !== 'string' ||
            !validTypes.status.includes(recordRequestParams[param])
          ) {
            errors.push(
              `cannot parse invalid status "${recordRequestParams[param]}"`
            );
          }

          break;
        case 'location':
          if (recordRequestParams[param] === undefined || null) {
            break;
          }

          if (typeof recordRequestParams[param] !== typeof validTypes[param]) {
            errors.push(
              `cannot parse invalid Location "${
                recordRequestParams[param]
              }" - location must be a comma separated string of numeric longitude and latitude`
            );
          } else {
            [long, lat] = recordRequestParams[param].split(',');
            if (
              typeof long === 'undefined' ||
              typeof jsonParse(long.trim()) !== 'number' ||
              (typeof lat === 'undefined' ||
                typeof jsonParse(lat.trim()) !== 'number')
            ) {
              errors.push(
                `cannot parse invalid Location "${
                  recordRequestParams[param]
                }" - location must be a comma separated string of numeric longitude and latitude`
              );
            }
          }

          break;
        default:
          if (recordRequestParams[param] === undefined || null) {
            break;
          }

          if (typeof recordRequestParams[param] !== typeof validTypes[param]) {
            errors.push(
              `invalid ${param} "${
                recordRequestParams[param]
              }" - ${param} should be a ${validTypes[param]}`
            );
          }
          break;
      }
    });
  }

  if (errors.length > 0) {
    return handleError(res, errors, 422);
  }
  return next();
};
