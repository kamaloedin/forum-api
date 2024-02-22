const CommentDetails = require('../CommentDetails');

describe('CommentDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = [
      {
        id: 'comment-01',
        date: expect.any(Date),
        content: 'first comment',
        isDelete: false,
        likeCount: 1,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        isDelete: true,
        likeCount: 0,
      },
    ];

    const mockReplies = [
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

    expect(() => new CommentDetails(payload, mockReplies)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = [
      {
        id: 'comment-01',
        username: [],
        date: expect.any(Date),
        content: 'first comment',
        isDelete: false,
        likeCount: 1,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        isDelete: true,
        likeCount: 0,
      },
    ];

    const mockReplies = [
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

    expect(() => new CommentDetails(payload, mockReplies)).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentDetails object correctly', () => {
    const payload = [
      {
        id: 'comment-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first comment',
        isDelete: false,
        likeCount: 1,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        isDelete: true,
        likeCount: 0,
      },
    ];

    const mockReplies = [
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

    const mappedComments = [
      {
        id: 'comment-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first comment',
        likeCount: 1,
        replies: [
          {
            id: 'reply-01',
            username: 'john-01',
            date: expect.any(Date),
            content: 'first reply',
          },
        ],
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: '**komentar telah dihapus**',
        likeCount: 0,
        replies: [
          {
            id: 'reply-02',
            username: 'john-02',
            date: expect.any(Date),
            content: '**balasan telah dihapus**',
          },
        ],
      },
    ];

    const { comments } = new CommentDetails(payload, mockReplies);

    expect(comments).toEqual(mappedComments);
  });
});
