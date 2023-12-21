const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ServerTestHelper.cleanTable();
  });

  describe('when POST /replies', () => {
    it('should response 404 when thread could not be found or invalid', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const requestPayload = {
        content: 'this is a reply',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread999/comments/comment-321/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak bisa ditemukan');
    });

    it('should response 404 when comment could not be found or invalid', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      const server = await createServer(container);

      const requestPayload = {
        content: '404 comment testing',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments/comment999/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak bisa ditemukan');
    });

    it('should response 201 and persisted reply', async () => {
      const requestPayload = {
        content: 'this is a reply',
      };

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments/comment-321/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments/comment-321/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload did not meet data type specification', async () => {
      const requestPayload = {
        content: [],
      };

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments/comment-321/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai',
      );
    });
  });
});
