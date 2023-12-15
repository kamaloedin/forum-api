const HelloHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'helloWorlds',
  register: async (server, { container }) => {
    const helloHandler = new HelloHandler(container);
    server.route(routes(helloHandler));
  },
};
