import { User } from '../models/users';
import { hashPass } from '../helpers/password_helpers';
import successResponse from '../helpers/successResponse';

const createUser = (req, res) => {
  const newUser = new User(req.body);
  newUser.password = hashPass(newUser.password);
  newUser.save(1).then(({ rows }) => successResponse(res, rows[0], 201));
};

export default {
  createUser,
};
