/* istanbul ignore file */

/* eslint-disable object-curly-newline */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikeTableTestHelper = {
  async addCommentLike({ id = 'comment_like-123', userId = 'user-123', commentId = 'comment-123' }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await pool.query(query);
  },

  async deleteCommentLike({ userId = 'user-123', commentId = 'comment-123' }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await pool.query(query);
  },

  async findCommentLikesById(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes CASCADE');
  },
};

module.exports = CommentLikeTableTestHelper;
