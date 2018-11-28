import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

export default {
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
};
