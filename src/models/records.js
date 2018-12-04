import { recordStore } from '../config/db';

export class Record {
  constructor({ title, type, createdBy, comment, location, images, videos }) {
    this.title = title;
    this.type = type;
    this.createdBy = createdBy;
    this.comment = comment;
    this.location = location;
    this.images = images;
    this.videos = videos;
    this.status = 'draft';
  }

  static getAll(type) {
    const allRecords = recordStore.fetch();
    return Promise.resolve(allRecords.filter(record => record.type === type));
  }

  static getOneByID(id) {
    const theOne = recordStore.fetch().filter(record => record.id === id);
    return Promise.resolve(...theOne);
  }

  static patch(id, patch, prop) {
    recordStore[id - 1][prop] = patch;
    return Record.getOneByID(id);
  }

  static delete(id) {
    return recordStore.delete(id);
  }

  save() {
    return recordStore.commit(this);
  }
}

export class RedFlag extends Record {
  constructor({ ...args }) {
    super({ type: 'red-flag', ...args });
  }

  static getAll() {
    return super.getAll('red-flag');
  }

  static getOneByID(id) {
    return super.getOneByID(id);
  }

  static patch(id, patch, prop) {
    return super.patch(id, patch, prop);
  }

  static delete(id) {
    return super.delete(id);
  }
}
