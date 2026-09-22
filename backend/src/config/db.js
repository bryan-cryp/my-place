const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://myplace_user:myplace_pass@localhost:5432/myplace_db';

const useSsl = String(process.env.DATABASE_SSL).toLowerCase() === 'true';

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = pool;
