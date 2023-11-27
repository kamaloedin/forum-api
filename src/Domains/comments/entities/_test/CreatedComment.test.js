const CreatedComment = require('../CreatedComment');

describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      comment: 'this is a comment',
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      content: true,
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create CreatedComment object correctly', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      content: 'this is a comment',
      owner: 'user-123',
    };

    const { id, content, owner } = new CreatedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
