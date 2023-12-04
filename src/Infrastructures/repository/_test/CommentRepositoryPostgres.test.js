const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
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

  describe('findCommentById function', () => {
    it('should throw NotFoundError when the comment is not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.findCommentById('comment-999')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when the comment is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.findCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should throw Authorization error if user does not match the owner of the comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'kamal-321')).rejects.toThrowError(
        AuthorizationError,
      );
    });

    it('should not throw Authorization error if user does match the owner of the comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123')).resolves.not.toThrowError(
        AuthorizationError,
      );
    });
  });

  describe('deleteComment function', () => {
    it('should change the is_delete attribute of the comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment('comment-123');
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return all comments in the thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-01' });
      await CommentsTableTestHelper.addComment({ id: 'comment-02' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.getCommentsByThreadId('thread-321');

      expect(result).toHaveLength(2);
      result.forEach((comment) => {
        expect(comment).toStrictEqual({
          id: expect.any(String),
          username: expect.any(String),
          date: expect.any(Date),
          content: expect.any(String),
          is_delete: expect.any(Boolean),
        });
      });
    });
  });
});
