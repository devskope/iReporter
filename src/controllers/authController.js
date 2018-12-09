import { User } from '../models/users';
import { hashPass } from '../helpers/password_helpers';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

const createUser = (req, res) => {
  if (req.foundUser)
    handleError(res, `User ${req.foundUser.username} already registered`, 409);
  else {
    const newUser = new User(req.body);
    newUser.password = hashPass(newUser.password);
    newUser.save(1).then(({ rows }) => successResponse(res, rows[0], 201));
  }
};

export default {
  createUser,
};
