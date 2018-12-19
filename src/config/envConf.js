import dotenv from 'dotenv';

dotenv.config();
const { env } = process;
const {
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  NODE_ENV,
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  SENDGRID_KEY,
} = env;

export default {
  ADMIN: {
    email: ADMIN_EMAIL,
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    firstname: ADMIN_FIRST_NAME,
    lastname: ADMIN_LAST_NAME,
  },
  DATABASE_URL,
  JWT_SECRET,
  NODE_ENV,
  PORT,
  SENDGRID_KEY,
};
