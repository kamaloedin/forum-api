const CreateComment = require('../../Domains/comments/entities/CreateComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.findThreadById(threadId);
    const createComment = new CreateComment(useCasePayload);
    const result = await this._commentRepository.addComment(createComment);
    return result;
  }
}

module.exports = AddCommentUseCase;
