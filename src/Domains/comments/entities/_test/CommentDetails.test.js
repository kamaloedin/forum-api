const CommentDetails = require('../CommentDetails');

describe('CommentDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = [
      {
        id: 'comment-01',
        date: expect.any(Date),
        content: 'first comment',
        isDelete: false,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        isDelete: true,
      },
    ];

    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = [
      {
        id: 'comment-01',
        username: [],
        date: expect.any(Date),
        content: 'first comment',
        isDelete: false,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        isDelete: true,
      },
    ];

    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentDetails object correctly', () => {
    const payload = [
      {
        id: 'comment-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first comment',
        isDelete: false,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        isDelete: true,
      },
    ];

    const mappedComments = [
      {
        id: 'comment-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first comment',
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: '**komentar telah dihapus**',
      },
    ];

    const { comments } = new CommentDetails(payload);

    expect(comments).toEqual(mappedComments);
  });
});
