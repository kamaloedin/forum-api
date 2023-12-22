class ReplyDetails {
  constructor(payload) {
    this.replies = payload.map((reply) => {
      this._verifyPayload(reply);
      const newReply = {
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
        commentId: reply.commentId,
      };
      if (reply.isDelete) {
        newReply.content = '**balasan telah dihapus**';
      }
      return newReply;
    });
  }

  _verifyPayload({
    id, username, date, content, isDelete, commentId,
  }) {
    if (
      !id
      || !username
      || !date
      || !content
      || isDelete === undefined
      || !commentId
    ) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'object'
      || typeof content !== 'string'
      || typeof isDelete !== 'boolean'
      || typeof commentId !== 'string'
    ) {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetails;
