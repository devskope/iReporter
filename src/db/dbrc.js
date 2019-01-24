import debug from 'debug';
import db from './db';

const logger = debug('iReporter::dbOps:');
const Models = {
  userSchema: `
    CREATE TABLE IF NOT EXISTS users
      (
       id SERIAL PRIMARY KEY,
       firstname VARCHAR NOT NULL,
       lastname  VARCHAR NOT NULL,
       othernames VARCHAR,
       username  VARCHAR UNIQUE NOT NULL,
       password  VARCHAR NOT NULL,
       email  VARCHAR NOT NULL,
       phone  VARCHAR,
       registered TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       email_notify BOOLEAN DEFAULT 'false',
       is_admin BOOLEAN DEFAULT 'false'
      )`,

  recordSchema: `
    CREATE TABLE IF NOT EXISTS records
      (
       id       SERIAL PRIMARY KEY,
       created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       created_by INTEGER,
       title VARCHAR NOT NULL,
       type  VARCHAR NOT NULL,
       comment VARCHAR NOT NULL,
       location VARCHAR,
       status VARCHAR NOT NULL,
       email_notify BOOLEAN DEFAULT 'false',
       images TEXT,
       videos TEXT,
       FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
      )`,
};
const dropTable = table => `DROP TABLE IF EXISTS ${table} CASCADE`;

const dbInit = async () => {
  await db.query(Models.userSchema);
  await db.query(Models.recordSchema);
  logger('Created DB Tables');
};

const blowAway = async () => {
  await db.query(dropTable('records'));
  await db.query(dropTable('users'));
  logger(`Drop DB Tables`);
};

process.argv.forEach(arg => {
  if (arg === 'init') dbInit();
  else if (arg === 'drop') blowAway();
});

export default { dbInit, blowAway };
