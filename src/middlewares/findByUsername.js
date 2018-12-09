import { User } from '../models/users';

export default (req, res, next) => {
  const { body } = req;
  User.findByUsername(body.username).then(({ rows }) =>
    rows[0]
      ? (() => {
          req.foundUser = { ...rows[0] };
          next();
        })()
      : next()
  );
};
