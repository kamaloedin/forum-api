/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class ThreadDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments.map((obj) => {
      const newObj = {
        id: obj.id,
        username: obj.username,
        date: obj.date,
        content: obj.content,
      };
      if (obj.isDelete) {
        newObj.content = '**komentar telah dihapus**';
      }
      return newObj;
    });
  }

  _verifyPayload({ id, title, body, date, username, comments }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'object' ||
      typeof username !== 'string' ||
      typeof comments !== 'object'
    ) {
      throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetails;
