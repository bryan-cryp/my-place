const pool = require('../config/db');

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, full_name, email, role, created_at FROM admins WHERE id = $1',
    [id],
  );
  return rows[0] || null;
}

async function create({ fullName, email, passwordHash, role = 'admin' }) {
  const { rows } = await pool.query(
    `INSERT INTO admins (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, created_at`,
    [fullName, email, passwordHash, role],
  );
  return rows[0];
}

async function countAll() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM admins');
  return rows[0].count;
}

module.exports = { findByEmail, findById, create, countAll };
