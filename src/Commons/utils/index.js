/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mapDBtoModel = ({ id, username, date, content, is_delete }) => ({
  id,
  username,
  date,
  content,
  isDelete: is_delete,
});

module.exports = mapDBtoModel;
