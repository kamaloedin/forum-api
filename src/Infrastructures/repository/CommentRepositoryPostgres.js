const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const { content, owner, threadId } = createComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, owner, 'NOW()', content, false, threadId],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM  comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak bisa ditemukan');
    }
  }

  async verifyCommentAccess(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM  comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('User tidak dapat mengakses komentar');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: 'SELECT c.id, u.username, c.date, c.content, c.is_delete, c.like_count FROM comments c INNER JOIN users u on c.owner = u.id WHERE c.thread_id = $1 ORDER BY c.date ASC',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async findCommentLike({ userId, commentId }) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async addCommentLike({ userId, commentId }) {
    const id = `comment_likes-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteCommentLike({ userId, commentId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async updateLikeCount(commentId, isAdded) {
    if (isAdded) {
      const query = {
        text: 'UPDATE comments SET like_count = like_count - 1 WHERE id = $1',
        values: [commentId],
      };
      await this._pool.query(query);
    } else {
      const query = {
        text: 'UPDATE comments SET like_count = like_count + 1 WHERE id = $1',
        values: [commentId],
      };
      await this._pool.query(query);
    }
  }
}

module.exports = CommentRepositoryPostgres;
