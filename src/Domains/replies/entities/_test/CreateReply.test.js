const CreateReply = require('../CreateReply');

describe('a CreateReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123',
    };

    expect(() => new CreateReply(payload)).toThrowError(
      'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: true,
      owner: 'user-123',
      commentId: 'comment-321',
      threadId: 'thread-321',
    };

    expect(() => new CreateReply(payload)).toThrowError(
      'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreateReply object correctly', () => {
    const payload = {
      content: 'this is a reply',
      owner: 'user-123',
      commentId: 'comment-321',
      threadId: 'thread-321',
    };

    const {
      content, owner, commentId, threadId,
    } = new CreateReply(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
  });
});
