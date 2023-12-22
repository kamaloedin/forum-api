const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
});
