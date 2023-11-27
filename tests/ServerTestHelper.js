/* istanbul ignore file */

const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ServerTestHelper = {
  async getAccessToken() {
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(payload);
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users, authentications CASCADE');
  },
};

module.exports = ServerTestHelper;
