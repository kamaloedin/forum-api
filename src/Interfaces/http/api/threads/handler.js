/* eslint-disable object-curly-newline */
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadsHandler = this.getThreadsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id } = await addThreadUseCase.execute({ title, body, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id,
          title,
          owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async getThreadsHandler(request, h) {
    const getThreadDetailsUseCase = this._container.getInstance(GetThreadDetailsUseCase.name);
    const { threadId } = request.params;
    const { id, title, body, date, username, comments } = await getThreadDetailsUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: {
          id,
          title,
          body,
          date,
          username,
          comments,
        },
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
