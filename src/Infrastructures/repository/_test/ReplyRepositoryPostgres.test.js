const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addReply function', () => {
    it('should persist the reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });

      const fakeIdGenerator = () => '321';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const createReply = new CreateReply({
        content: 'this is a reply',
        owner: 'user-123',
        commentId: 'comment-321',
        threadId: 'thread-321',
      });

      await replyRepositoryPostgres.addReply(createReply);
      const result = await RepliesTableTestHelper.findReplyById('reply-321');

      expect(result).toHaveLength(1);
    });

    it('should return the added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });

      const fakeIdGenerator = () => '321';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const createReply = new CreateReply({
        content: 'this is a reply',
        owner: 'user-123',
        commentId: 'comment-321',
        threadId: 'thread-321',
      });

      const addedReply = await replyRepositoryPostgres.addReply(createReply);

      expect(addedReply).toStrictEqual(
        new CreatedReply({
          id: 'reply-321',
          content: 'this is a reply',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return all replies in the comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      await RepliesTableTestHelper.addReply({ id: 'reply-01' });
      await RepliesTableTestHelper.addReply({ id: 'reply-02' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const result = await replyRepositoryPostgres.getRepliesByThreadId(
        'thread-321',
      );

      expect(result).toStrictEqual([
        {
          id: expect.any(String),
          username: expect.any(String),
          date: expect.any(Date),
          content: expect.any(String),
          is_delete: expect.any(Boolean),
          comment_id: expect.any(String),
        },
        {
          id: expect.any(String),
          username: expect.any(String),
          date: expect.any(Date),
          content: expect.any(String),
          is_delete: expect.any(Boolean),
          comment_id: expect.any(String),
        },
      ]);
    });
  });

  describe('findReplyById function', () => {
    it('should throw NotFoundError when the reply is not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.findReplyById('reply-01'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when the reply is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      await RepliesTableTestHelper.addReply({ id: 'reply-321' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.findReplyById('reply-321'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyAccess function', () => {
    it('should throw Authorization error if user does not match the owner of the reply', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      await RepliesTableTestHelper.addReply({ id: 'reply-321' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyReplyAccess('reply-321', 'kamal-321'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw Authorization error if user does match the owner of the comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      await RepliesTableTestHelper.addReply({ id: 'reply-321' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyReplyAccess('reply-321', 'user-123'),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should change the is_delete attribute of the reply', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      await RepliesTableTestHelper.addReply({ id: 'reply-01' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-01');

      const result = await RepliesTableTestHelper.checkIsDelete('reply-01');
      expect(result.is_delete).toEqual(true);
    });
  });
});
