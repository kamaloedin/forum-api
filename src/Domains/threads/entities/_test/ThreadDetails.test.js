const ThreadDetails = require('../ThreadDetails');

describe('ThreadDetails entities', () => {
  it('should throw error when payload did not contain needed properties', () => {
    const payload = {
      id: 'thread-321',
      body: 'a thread body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    };

    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-321',
      title: [],
      body: 'a thread body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    };

    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetails object correctly', () => {
    const payload = {
      id: 'thread-321',
      title: 'a thread',
      body: 'a thread body',
      date: expect.any(Date),
      username: 'dicoding',
    };

    const threadDetails = new ThreadDetails(payload);

    expect(threadDetails.id).toEqual(payload.id);
    expect(threadDetails.title).toEqual(payload.title);
    expect(threadDetails.body).toEqual(payload.body);
    expect(threadDetails.date).toEqual(payload.date);
    expect(threadDetails.username).toEqual(payload.username);
  });
});
