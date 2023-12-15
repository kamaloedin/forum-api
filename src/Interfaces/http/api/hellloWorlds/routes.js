const routes = (handler) => [
  {
    method: 'POST',
    path: '/hello',
    handler: handler.postHelloHandler,
  },
];

module.exports = routes;
