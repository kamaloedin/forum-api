const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addThread Function', () => {
    it('should persist create thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const createThread = new CreateThread({
        title: 'Dicoding',
        body: 'Dicoding is the best!',
        owner: 'user-123',
      });
      const fakeThreadIdGenerator = () => 'h_W1Plfpj0TY7wyT2PUPX';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeThreadIdGenerator);

      await threadRepositoryPostgres.addThread(createThread);

      const threads = await ThreadTableTestHelper.findThreadById('thread-h_W1Plfpj0TY7wyT2PUPX');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const createThread = new CreateThread({
        title: 'Dicoding',
        body: 'Dicoding is the best!',
        owner: 'user-123',
      });
      const fakeThreadIdGenerator = () => 'h_W1Plfpj0TY7wyT2PUPX';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeThreadIdGenerator);

      const createdThread = await threadRepositoryPostgres.addThread(createThread);

      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
          title: 'Dicoding',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('findThreadById function', () => {
    it('should throw NotFoundError when the thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.findThreadById('thread-321')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when the thread is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.findThreadById('thread-321')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when the thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-321')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when the thread is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-321')).resolves.not.toThrowError(NotFoundError);
    });

    it('should return thread details when thread is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-321', date: '2023-11-29T06:11:34.936Z' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-321')).resolves.toStrictEqual({
        id: expect.any(String),
        title: 'Dicoding',
        body: 'Dicoding is the best!',
        date: expect.any(Date),
        username: 'dicoding',
      });
    });
  });
});
