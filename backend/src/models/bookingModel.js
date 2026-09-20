const pool = require('../config/db');

async function create(data) {
  const {
    fullName, email, phone, whatsappNumber, checkIn, checkOut,
    adults, children, bookingType, airportTransfer, message,
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO bookings
      (full_name, email, phone, whatsapp_number, check_in, check_out,
       adults, children, booking_type, airport_transfer, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [fullName, email, phone, whatsappNumber || null, checkIn, checkOut,
      adults, children, bookingType, !!airportTransfer, message || null],
  );
  return rows[0];
}

async function findAll({ status, search, limit = 50, offset = 0 }) {
  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    conditions.push(
      `(LOWER(full_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR phone LIKE $${params.length})`,
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit);
  params.push(offset);

  const { rows } = await pool.query(
    `SELECT * FROM bookings ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  return rows;
}

async function count({ status, search }) {
  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    conditions.push(
      `(LOWER(full_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR phone LIKE $${params.length})`,
    );
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM bookings ${where}`, params);
  return rows[0].count;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updateStatus(id, status, adminNotes) {
  const { rows } = await pool.query(
    `UPDATE bookings SET status = $2, admin_notes = COALESCE($3, admin_notes)
     WHERE id = $1 RETURNING *`,
    [id, status, adminNotes],
  );
  return rows[0] || null;
}

async function update(id, fields) {
  const allowed = ['full_name', 'email', 'phone', 'whatsapp_number', 'check_in', 'check_out',
    'adults', 'children', 'booking_type', 'airport_transfer', 'message', 'status', 'admin_notes'];
  const sets = [];
  const params = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (allowed.includes(key)) {
      params.push(value);
      sets.push(`${key} = $${params.length}`);
    }
  });

  if (!sets.length) return findById(id);

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE bookings SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params,
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
  return rowCount > 0;
}

async function getStats() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed,
      COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'confirmed' AND check_in >= CURRENT_DATE)::int AS upcoming
    FROM bookings
  `);
  return rows[0];
}

/** Checks whether the requested range overlaps any confirmed booking or manual block. */
async function hasConflict(checkIn, checkOut) {
  const { rows } = await pool.query(
    `SELECT 1 FROM bookings
      WHERE status IN ('pending','confirmed')
        AND daterange(check_in, check_out) && daterange($1::date, $2::date)
      UNION
     SELECT 1 FROM blocked_dates
      WHERE daterange(start_date, end_date) && daterange($1::date, $2::date)
      LIMIT 1`,
    [checkIn, checkOut],
  );
  return rows.length > 0;
}

module.exports = {
  create, findAll, count, findById, updateStatus, update, remove, getStats, hasConflict,
};
