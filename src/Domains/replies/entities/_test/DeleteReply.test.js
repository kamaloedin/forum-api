const DeleteReply = require('../DeleteReply');

describe('DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-321',
      owner: 'user-123',
    };

    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      threadId: 'thread-321',
      commentId: true,
      replyId: 'reply-321',
      owner: 'user-123',
    };

    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create delete comment object correctly', () => {
    const payload = {
      threadId: 'thread-321',
      commentId: 'comment-321',
      replyId: 'reply-321',
      owner: 'user-123',
    };

    const {
      threadId, commentId, replyId, owner,
    } = new DeleteReply(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(replyId).toEqual(payload.replyId);
    expect(owner).toEqual(payload.owner);
  });
});
