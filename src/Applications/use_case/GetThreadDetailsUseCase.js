const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadDetails = new ThreadDetails({ ...thread, comments });
    return threadDetails;
  }
}

module.exports = GetThreadDetailsUseCase;
