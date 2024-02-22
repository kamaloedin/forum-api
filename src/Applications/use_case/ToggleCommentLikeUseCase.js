const CommentLikes = require('../../Domains/comments/entities/CommentLikes');

class ToggleCommentLikeUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { commentId, threadId } = useCasePayload;
    await this._threadRepository.findThreadById(threadId);
    await this._commentRepository.findCommentById(commentId);
    const commentLikes = new CommentLikes(useCasePayload);
    const result = await this._commentRepository.findCommentLike(commentLikes);
    if (!result) {
      await this._commentRepository.addCommentLike(commentLikes);
      await this._commentRepository.updateLikeCount(commentId, false);
    } else {
      await this._commentRepository.deleteCommentLike(commentLikes);
      await this._commentRepository.updateLikeCount(commentId, true);
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
