import db from '../db/db';
import env from '../config/envConf';
import { hashPass } from '../helpers/password_helpers';

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
  }) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.othernames = othernames;
    this.username = username;
    this.password = hashPass(password);
    this.email = email;
    this.phone = phone;
    this.isAdmin = false;
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
          phone)
         VALUES($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
      [
        this.firstname,
        this.lastname,
        this.othernames,
        this.username,
        this.password,
        this.email,
        this.phone,
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

  static init() {
    super.findByUsername(ADMIN.username).then(({ rows }) =>
      !rows[0]
        ? (async () => {
            await new Admin(ADMIN).save();
          })()
        : null
    );
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

Admin.init();
