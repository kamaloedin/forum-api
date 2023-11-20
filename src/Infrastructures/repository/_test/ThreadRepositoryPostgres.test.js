const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

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
});
