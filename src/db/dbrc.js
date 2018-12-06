import debug from 'debug';
import db from './db';

const logger = debug('iReporter::initdb:');
const Models = {
  userSchema: `
    CREATE TABLE IF NOT EXISTS users
      (
       id SERIAL PRIMARY KEY,
       firstname VARCHAR NOT NULL,
       lastname  VARCHAR NOT NULL,
       othernames VARCHAR,
       username  VARCHAR UNIQUE NOT NULL,
       email  VARCHAR NOT NULL,
       phone  VARCHAR,
       registered TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       is_admin BOOLEAN DEFAULT 'false'
      )`,

  recordSchema: `
    CREATE TABLE IF NOT EXISTS records
      (
       id       SERIAL PRIMARY KEY,
       created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       created_by VARCHAR NOT NULL,
       title VARCHAR NOT NULL,
       type  VARCHAR NOT NULL,
       comment VARCHAR NOT NULL,
       location VARCHAR,
       status VARCHAR NOT NULL
      )`,
};
const dropTable = table => `DROP TABLE IF EXISTS ${table} CASCADE`;

const dbInit = () =>
  Promise.all([
    db.query(Models.recordSchema),
    db.query(Models.userSchema),
  ]).then(() => logger(`Created  DB Tables`));

const blowAway = () => {
  Promise.all([
    db.query(dropTable('records')),
    db.query(dropTable('users')),
  ]).then(() => logger(`Drop DB Tables`));
};

dbInit();

export default { dbInit, blowAway };
