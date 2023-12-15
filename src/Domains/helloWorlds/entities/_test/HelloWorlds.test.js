const HelloWorlds = require('../HelloWorlds');

describe('a HelloWorlds entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new HelloWorlds(payload)).toThrowError('HELLO_WORLDS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      name: [],
    };

    expect(() => new HelloWorlds(payload)).toThrowError('HELLO_WORLDS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create hello world object correctly', () => {
    const payload = {
      name: 'Kamal',
    };

    const { name } = new HelloWorlds(payload);

    expect(name).toEqual(payload.name);
  });
});
