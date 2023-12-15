class HelloWorlds {
  constructor(payload) {
    this._verifyPayload(payload);

    this.name = payload.name;
  }

  _verifyPayload({ name }) {
    if (!name) {
      throw new Error('HELLO_WORLDS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof name !== 'string') {
      throw new Error('HELLO_WORLDS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = HelloWorlds;
