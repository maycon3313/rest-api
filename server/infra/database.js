const pgPromise = require('pg-promise');

function createDatabase(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error(
      'Defina a variável de ambiente DATABASE_URL para conectar ao PostgreSQL.'
    );
  }

  const pgp = pgPromise();
  const db = pgp(connectionString);

  return {
    db,
    close: () => pgp.end()
  };
}

module.exports = { createDatabase };
