/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mapDBToModel = ({ id, username, date, content, is_delete, like_count }) => ({
  id,
  username,
  date,
  content,
  isDelete: is_delete,
  likeCount: like_count,
});

const mapDBReplyToModel = ({ id, username, date, content, is_delete, comment_id }) => ({
  id,
  username,
  date,
  content,
  isDelete: is_delete,
  commentId: comment_id,
});

const mapDBCommentLikesToModel = ({ id, user_id, comment_id }) => ({
  id,
  userId: user_id,
  commentId: comment_id,
});

module.exports = { mapDBToModel, mapDBReplyToModel, mapDBCommentLikesToModel };
