const mapDBtoModel = require('../../Commons/utils');
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');
// const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const rawComments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const mappedComments = rawComments.map(mapDBtoModel);
    // const commmentWithReplies = mappedComments.map(async (comment) => {
    //   const rawReplies = await this._replyRepository.getRepliesByCommentId(
    //     comment.id,
    //   );
    //   const mappedReplies = rawReplies.map(mapDBtoModel);
    //   const replies = new ReplyDetails(mappedReplies);
    //   return {
    //     ...comment,
    //     replies,
    //   };
    // });
    const threadDetails = new ThreadDetails({ ...thread });
    const comments = new CommentDetails(mappedComments);
    const fullDetails = { ...threadDetails, ...comments };
    return fullDetails;
  }
}

module.exports = GetThreadDetailsUseCase;
