const createServer = require('../createServer');
const container = require('../../container');

describe('/hello endpoint', () => {
  describe('when POST /hello', () => {
    it('should response 201', async () => {
      const requestPayload = {
        name: 'Kamal',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/hello',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
    });
  });
});
