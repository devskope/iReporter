import { User } from '../models/users';
import { passMatch } from '../helpers/password_helpers';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';
import tokenGen from '../helpers/tokenGen';

const createUser = (req, res) => {
  if (req.foundUser)
    handleError(res, `User ${req.foundUser.username} already registered`, 409);
  else {
    const newUser = new User(req.body);
    newUser.save().then(({ rows }) => {
      const { password, ...user } = rows[0];
      successResponse(res, { token: tokenGen(user), user }, 201);
    });
  }
};

const loginUser = ({ body, foundUser }, res) => {
  if (foundUser) {
    const { password, ...user } = foundUser;
    passMatch(body.password, foundUser.password).then(match =>
      match
        ? successResponse(res, { token: tokenGen(user), user })
        : handleError(res, `Password incorrect`, 400)
    );
  } else handleError(res, `User ${body.username} not registered`, 401);
};

export default {
  createUser,
  loginUser,
};
