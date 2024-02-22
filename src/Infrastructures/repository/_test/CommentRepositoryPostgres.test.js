const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper');
const CommentLikes = require('../../../Domains/comments/entities/CommentLikes');

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
      await ThreadTableTestHelper.addThread({
        id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      });

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
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      });

      const createComment = new CreateComment({
        content: 'this is a comment',
        owner: 'user-123',
        threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      });
      const fakeIdGenerator = () => '321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(createComment);

      expect(addedComment).toStrictEqual(
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
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'kamal-321')).rejects.toThrowError(
        AuthorizationError,
      );
    });

    it('should not throw Authorization error if user does match the owner of the comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
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
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
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
          like_count: expect.any(Number),
        });
      });
    });
  });

  describe('findCommentLike function', () => {
    it('should return a match when a comment like exist', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikeTableTestHelper.addCommentLike({ id: 'comment_like-123' });

      const commentLikes = new CommentLikes({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.findCommentLike(commentLikes);
      expect(result.id).toStrictEqual(expect.any(String));
    });
  });

  describe('addCommentLike function', () => {
    it('should persist comment like', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentLikes = new CommentLikes({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '321';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addCommentLike(commentLikes);

      const result = await CommentLikeTableTestHelper.findCommentLikesById('comment_likes-321');
      expect(result.id).toStrictEqual(expect.any(String));
      expect(result.user_id).toStrictEqual(expect.any(String));
      expect(result.comment_id).toStrictEqual(expect.any(String));
    });
  });

  describe('deleteCommentLike function', () => {
    it('should not find comment like after it is deleted', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikeTableTestHelper.addCommentLike({ id: 'comment_like-123' });

      const commentLikes = new CommentLikes({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentLike(commentLikes);

      const result = await CommentLikeTableTestHelper.findCommentLikesById('comment_likes-123');
      expect(result).toStrictEqual(undefined);
    });
  });

  describe('updateLikeCount function', () => {
    it('should increase the like count if comment like is not added yet', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const initialLike = await CommentsTableTestHelper.getLikeCount('comment-123');
      await commentRepositoryPostgres.updateLikeCount('comment-123', false);
      const updatedLike = await CommentsTableTestHelper.getLikeCount('comment-123');

      expect(updatedLike).toStrictEqual(initialLike + 1);
    });
    it('should decrease the like count if comment like is already added', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.updateLikeCount('comment-123', false);
      const updatedLike = await CommentsTableTestHelper.getLikeCount('comment-123');
      await commentRepositoryPostgres.updateLikeCount('comment-123', true);
      const latestLike = await CommentsTableTestHelper.getLikeCount('comment-123');
      console.log(updatedLike);

      expect(latestLike).toStrictEqual(updatedLike - 1);
    });
  });
});
