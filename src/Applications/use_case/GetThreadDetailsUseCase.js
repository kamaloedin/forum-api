const { mapDBToModel, mapDBReplyToModel } = require('../../Commons/utils');
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    // Ambil thread, comments dan replies dari database
    const thread = await this._threadRepository.getThreadById(threadId);
    const rawComments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const rawReplies = await this._replyRepository.getRepliesByThreadId(
      threadId,
    );

    // Map comments dan replies biar jadi camelCase
    const mappedReplies = rawReplies.map(mapDBReplyToModel);
    const mappedComments = rawComments.map(mapDBToModel);

    // Buat masing-masing entitas dan rangkai semua data
    const replyDetails = new ReplyDetails(mappedReplies); // verifikasi dan buang isDelete
    const { replies } = replyDetails;
    const comments = new CommentDetails(mappedComments, replies); // Masukkan reply ke comments dan verifikasi
    const threadDetails = new ThreadDetails({ ...thread }); // Buat Thread
    const fullDetails = { ...threadDetails, ...comments }; // Gabungkan thread dengan reply
    return fullDetails;
  }
}

module.exports = GetThreadDetailsUseCase;
