const CreatedReply = require('../CreatedReply');

describe('a CreatedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-321',
      owner: 'user-123',
    };

    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: [],
      content: 'this is a reply',
      owner: 'user-123',
    };

    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedReply object correctly', () => {
    const payload = {
      id: 'reply-321',
      content: 'this is a reply',
      owner: 'user-123',
    };

    const { id, content, owner } = new CreatedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
