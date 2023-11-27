const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id } = await addCommentUseCase.execute({ content, owner, threadId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id,
          content,
          owner,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
