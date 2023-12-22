/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class CommentDetails {
  constructor(payload, replyDetails) {
    this.comments = payload.map((comment) => {
      this._verifyPayload(comment);
      const filteredReplies = replyDetails.filter(
        (reply) => reply.commentId === comment.id,
      );
      const replies = filteredReplies.map((reply) => {
        const newReply = {
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.content,
        };

        return newReply;
      });
      const newComment = {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        replies,
      };
      if (comment.isDelete) {
        newComment.content = '**komentar telah dihapus**';
      }
      return newComment;
    });
  }

  _verifyPayload({ id, username, date, content, isDelete }) {
    if (!id || !username || !date || !content || isDelete === undefined) {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'object' ||
      typeof content !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetails;
