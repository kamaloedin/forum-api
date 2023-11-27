const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addComment Function', () => {
    it('should persist create comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-h_W1Plfpj0TY7wyT2PUPX' });

      const createComment = new CreateComment({
        content: 'this is a comment',
        owner: 'user-123',
        threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      });
      const fakeIdGenerator = () => '321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(createComment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-321');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-h_W1Plfpj0TY7wyT2PUPX' });

      const createComment = new CreateComment({
        content: 'this is a comment',
        owner: 'user-123',
        threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      });
      const fakeIdGenerator = () => '321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      expect(createdComment).toStrictEqual(
        new CreatedComment({
          id: 'comment-321',
          content: 'this is a comment',
          owner: 'user-123',
        }),
      );
    });
  });
});
