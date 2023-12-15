const SayHelloUseCase = require('../../../../Applications/use_case/SayHelloUseCase');

class HelloHandler {
  constructor(container) {
    this._container = container;

    this.postHelloHandler = this.postHelloHandler.bind(this);
  }

  postHelloHandler(request, h) {
    const sayHelloUseCase = this._container.getInstance(SayHelloUseCase.name);
    sayHelloUseCase.execute(request.payload);
    const response = h.response({
      status: 'success',
    });
    response.code(201);
    return response;
  }
}

module.exports = HelloHandler;
