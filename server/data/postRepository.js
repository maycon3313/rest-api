function createPostRepository(db) {
  return {
    findAll() {
      return db.any(
        'SELECT id, title, date FROM blog.post ORDER BY id'
      );
    },

    findById(id) {
      return db.oneOrNone(
        'SELECT id, title, date FROM blog.post WHERE id = $1',
        [id]
      );
    },

    create(title) {
      return db.one(
        'INSERT INTO blog.post (title) VALUES ($1) RETURNING id, title, date',
        [title]
      );
    },

    update(id, title) {
      return db.oneOrNone(
        'UPDATE blog.post SET title = $1 WHERE id = $2 RETURNING id, title, date',
        [title, id]
      );
    },

    delete(id) {
      return db.oneOrNone(
        'DELETE FROM blog.post WHERE id = $1 RETURNING id',
        [id]
      );
    }
  };
}

module.exports = { createPostRepository };
