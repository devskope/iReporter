import { Pool } from 'pg';
import env from '../config/envConf';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export default {
  query: (queryString, params) =>
    new Promise((resolve, reject) => {
      pool
        .query(queryString, params)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }),
};
