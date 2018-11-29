class RecDB extends Array {
  commit(record) {
    const recordToSave = {
      ...record,
      id: this.length + 1,
      createdOn: Date.now(),
    };
    this.push(recordToSave);
    return Promise.resolve(this.pop());
  }
}

const recordStore = new RecDB();

export default recordStore;
