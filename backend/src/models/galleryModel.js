const pool = require('../config/db');

async function findAll(category) {
  const params = [];
  let where = '';
  if (category && category !== 'all') {
    params.push(category);
    where = 'WHERE category = $1';
  }
  const { rows } = await pool.query(
    `SELECT * FROM gallery_images ${where} ORDER BY display_order ASC, created_at DESC`,
    params,
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM gallery_images WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ title, category, imageUrl, displayOrder = 0 }) {
  const { rows } = await pool.query(
    `INSERT INTO gallery_images (title, category, image_url, display_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [title, category, imageUrl, displayOrder],
  );
  return rows[0];
}

async function update(id, { title, category, imageUrl, displayOrder }) {
  const { rows } = await pool.query(
    `UPDATE gallery_images SET
       title = COALESCE($2, title),
       category = COALESCE($3, category),
       image_url = COALESCE($4, image_url),
       display_order = COALESCE($5, display_order)
     WHERE id = $1 RETURNING *`,
    [id, title, category, imageUrl, displayOrder],
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM gallery_images WHERE id = $1', [id]);
  return rowCount > 0;
}

async function count() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM gallery_images');
  return rows[0].count;
}

module.exports = { findAll, findById, create, update, remove, count };
