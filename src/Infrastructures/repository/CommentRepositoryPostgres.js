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
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING is_delete',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0].is_delete;
  }
}

module.exports = CommentRepositoryPostgres;
