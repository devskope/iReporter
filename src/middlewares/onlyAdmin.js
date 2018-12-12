import handleError from '../helpers/errorHelper';

export default ({ user }, res, next) =>
  user && user.is_admin
    ? next()
    : handleError(
        res,
        'you do not have sufficient privileges to access the requested resouce',
        401
      );
