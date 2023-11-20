const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
      owner: 'user-123',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: true,
      body: 'abc',
      owner: 'user-123',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 60 characters', () => {
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicodingindonesia',
      body: 'Dicoding is the best!',
      owner: 'user-123',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create createThread object correctly,', () => {
    const payload = {
      title: 'Dicoding',
      body: 'Dicoding is the best!',
      owner: 'user-123',
    };

    const { title, body, owner } = new CreateThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
