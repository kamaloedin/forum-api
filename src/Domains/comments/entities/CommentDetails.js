/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class CommentDetails {
  constructor(payload) {
    this.comments = payload.map((Comment) => {
      this._verifyPayload(Comment);
      const newComment = {
        id: Comment.id,
        username: Comment.username,
        date: Comment.date,
        content: Comment.content,
      };
      if (Comment.isDelete) {
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
