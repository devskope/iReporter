import db from '../db/db';

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
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.isAdmin = false;
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

  save() {
    const queryString = [
      `INSERT INTO records(firstname,
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
