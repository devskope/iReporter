import { recordStore } from '../config/db';

class Record {
  constructor({ title, type, createdBy, comment, location, images, videos }) {
    this.title = title;
    this.type = type;
    this.createdBy = createdBy;
    this.comment = comment;
    this.location = location;
    this.images = images;
    this.videos = videos;
    this.status = 'under investigation';
  }

  static getAll(type) {
    const allRecords = recordStore.fetch();
    return Promise.resolve(allRecords.filter(record => record.type === type));
  }

  static getOneByID(id, type) {
    const theOne = recordStore
      .fetch()
      .filter(record => record.type === type && record.id === id);
    return Promise.resolve(...theOne);
  }

  static patch(type, id, patch, prop) {
    recordStore[id - 1][prop] = patch;
    return Record.getOneByID(id, type);
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
    return super.getOneByID(id, 'red-flag');
  }

  static patch(id, patch, prop) {
    return super.patch('red-flag', id, patch, prop);
  }

  static delete(id) {
    return super.delete(id);
  }
}
