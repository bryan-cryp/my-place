const pool = require('../config/db');

async function create({ fullName, email, phone, subject, message }) {
  const { rows } = await pool.query(
    `INSERT INTO inquiries (full_name, email, phone, subject, message)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [fullName, email, phone || null, subject || null, message],
  );
  return rows[0];
}

async function findAll({ status, limit = 50, offset = 0 }) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }
  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  return rows;
}

async function count({ status }) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM inquiries ${where}`, params);
  return rows[0].count;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM inquiries WHERE id = $1', [id]);
  return rows[0] || null;
}

async function update(id, { status, adminNotes }) {
  const { rows } = await pool.query(
    `UPDATE inquiries SET status = COALESCE($2, status), admin_notes = COALESCE($3, admin_notes)
     WHERE id = $1 RETURNING *`,
    [id, status, adminNotes],
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM inquiries WHERE id = $1', [id]);
  return rowCount > 0;
}

async function countNew() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM inquiries WHERE status = 'new'");
  return rows[0].count;
}

module.exports = { create, findAll, count, findById, update, remove, countNew };
