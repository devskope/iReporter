import jwt from 'jsonwebtoken';
import env from '../config/envConf';

export default payload =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
