class RecDB extends Array {
  clear() {
    this.length = 0;
  }

  fetch() {
    return this;
  }

  commit(record) {
    const recordToSave = {
      ...record,
      id: this.length + 1,
      createdOn: Date.now(),
    };
    this.push(recordToSave);
    return Promise.resolve(...this.slice(-1));
  }

  delete(id) {
    this.splice(id - 1, 1);
    return Promise.resolve(id);
  }
}

export const recordStore = new RecDB();