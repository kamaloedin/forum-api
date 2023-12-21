const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this.threadRepository.findThreadById(useCasePayload.threadId);
    await this.commentRepository.findCommentById(useCasePayload.commentId);
    const createReply = new CreateReply(useCasePayload);
    return this.replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
