import debug from 'debug';
import db from '../db/db';
import env from '../config/envConf';
import { hashPass } from '../helpers/password_helpers';

const logger = debug('iReporter::users:');
const { ADMIN } = env;

export class User {
  constructor({
    firstname,
    lastname,
    othernames,
    username,
    password,
    email,
    phone,
    emailNotify,
  }) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.othernames = othernames;
    this.username = username;
    this.password = hashPass(password);
    this.email = email;
    this.phone = phone;
    this.emailNotify = emailNotify || false;
    this.isAdmin = false;
  }

  static findByID(id) {
    const queryString = [`SELECT * FROM users WHERE id = $1`, [id]];
    return db.query(...queryString);
  }

  static findByUsername(username) {
    const queryString = [`SELECT * FROM users WHERE username = $1`, [username]];
    return db.query(...queryString);
  }

  save() {
    const queryString = [
      `INSERT INTO users(firstname,
          lastname,
          othernames,
          username,
          password,
          email,
          phone,
          email_notify
          )
         VALUES($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
      [
        this.firstname,
        this.lastname,
        this.othernames,
        this.username,
        this.password,
        this.email,
        this.phone,
        this.emailNotify,
      ],
    ];
    return db.query(...queryString);
  }
}

export class Admin extends User {
  constructor({ ...args }) {
    super(args);
    this.isAdmin = true;
  }

  /* istanbul ignore next */
  static init() {
    super.findByUsername(ADMIN.username).then(async ({ rowCount }) => {
      if (rowCount < 1) {
        await new Admin(ADMIN).save();
        logger(`Admin Spawned`);
      }
    });
  }

  save() {
    const queryString = [
      `INSERT INTO users(firstname,
        lastname,
        othernames,
        username,
        password,
        email,
        phone, is_admin)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        this.firstname,
        this.lastname,
        this.othernames,
        this.username,
        this.password,
        this.email,
        this.phone,
        this.isAdmin,
      ],
    ];
    return db.query(...queryString);
  }
}

process.argv.forEach(arg => {
  if (arg === 'spawn-admin') Admin.init();
});
