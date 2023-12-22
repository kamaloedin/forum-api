const ReplyDetails = require('../ReplyDetails');

describe('ReplyDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = [
      {
        id: 'reply-01',
        date: expect.any(Date),
        content: 'first reply',
        isDelete: false,
        commentId: 'comment-01',
      },
      {
        id: 'reply-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second reply',
        isDelete: true,
        commentId: 'comment-02',
      },
    ];

    expect(() => new ReplyDetails(payload)).toThrowError(
      'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = [
      {
        id: 'reply-01',
        username: [],
        date: expect.any(Date),
        content: 'first reply',
        isDelete: false,
        commentId: 'comment-01',
      },
      {
        id: 'reply-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second reply',
        isDelete: true,
        commentId: 'comment-02',
      },
    ];

    expect(() => new ReplyDetails(payload)).toThrowError(
      'REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create ReplyDetails object correctly', () => {
    const payload = [
      {
        id: 'reply-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first reply',
        isDelete: false,
        commentId: 'comment-01',
      },
      {
        id: 'reply-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second reply',
        isDelete: true,
        commentId: 'comment-02',
      },
    ];

    const mappedReplies = [
      {
        id: 'reply-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first reply',
        commentId: 'comment-01',
      },
      {
        id: 'reply-02',
        username: 'john-02',
        date: expect.any(Date),
        content: '**balasan telah dihapus**',
        commentId: 'comment-02',
      },
    ];

    const { replies } = new ReplyDetails(payload);

    expect(replies).toEqual(mappedReplies);
  });
});
