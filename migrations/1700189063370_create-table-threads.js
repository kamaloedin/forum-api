/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(60)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIME',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'threads',
    'fk_threads.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
