const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({
    content, owner, commentId, threadId,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, owner, 'NOW()', content, false, threadId, commentId],
    };

    const result = await this._pool.query(query);
    return new CreatedReply(result.rows[0]);
  }

  async getRepliesByThreadId(id) {
    const query = {
      text: 'SELECT r.id, u.username, r.date, r.content, r.is_delete, r.comment_id FROM replies r INNER JOIN users u on r.owner = u.id WHERE r.thread_id = $1 ORDER BY r.date ASC',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async findReplyById(id) {
    const query = {
      text: 'SELECT id, owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak bisa ditemukan');
    }
  }

  async verifyReplyAccess(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('User tidak dapat mengakses balasan');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
