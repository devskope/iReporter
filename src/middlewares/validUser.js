import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import env from '../config/envConf';
import handleError from '../helpers/errorHelper';

const verifyToken = token =>
  new Promise((resolve, reject) => {
    try {
      resolve(jwt.verify(token, env.JWT_SECRET));
    } catch (e) {
      reject(e);
    }
  });

export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.split(' ')[1]) {
    handleError(res, 'Unauthorized! No token provided.', 401);
  } else {
    const authToken = authHeader.split(' ')[1];
    verifyToken(authToken)
      .then(({ username }) => {
        User.findByUsername(username)
          .then(({ rows }) => {
            const [{ password, ...user }] = rows;
            req.user = user;
            next();
          })
          .catch(() =>
            handleError(res, `Ooops something happened, can't find User`, 400)
          );
      })
      .catch(error => handleError(res, error.message, 400));
  }
};
