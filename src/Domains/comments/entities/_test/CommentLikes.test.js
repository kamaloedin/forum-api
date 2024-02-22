const CommentLikes = require('../CommentLikes');

describe('CommentLikes entities', () => {
  it('should throw error when payload did not contain property', () => {
    const payload = {
      commentId: 'comment-123',
    };

    expect(() => new CommentLikes(payload)).toThrowError('COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      userId: true,
      commentId: 'thread-321',
    };

    expect(() => new CommentLikes(payload)).toThrowError('COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentLikes object correctly', () => {
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const { userId, commentId } = new CommentLikes(payload);

    expect(userId).toEqual(payload.userId);
    expect(commentId).toEqual(payload.commentId);
  });
});
