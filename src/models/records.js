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

  set setStatus(status) {
    this.status = status;
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
    const allRecords = recordStore.fetch();
    return Promise.resolve(
      allRecords.filter(record => record.type === 'red-flag')
    );
  }
}
