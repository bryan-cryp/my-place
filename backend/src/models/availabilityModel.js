const pool = require('../config/db');

async function findAllBlocked() {
  const { rows } = await pool.query(
    'SELECT * FROM blocked_dates ORDER BY start_date ASC',
  );
  return rows;
}

/** Combined calendar feed: manual blocks + active bookings, for the admin calendar view. */
async function findCalendarFeed() {
  const { rows } = await pool.query(`
    SELECT id, start_date, end_date, reason, NULL::uuid AS booking_id, 'blocked' AS source
    FROM blocked_dates
    UNION ALL
    SELECT id, check_in AS start_date, check_out AS end_date,
           CONCAT(full_name, ' — ', status) AS reason, id AS booking_id, 'booking' AS source
    FROM bookings
    WHERE status IN ('pending', 'confirmed')
    ORDER BY start_date ASC
  `);
  return rows;
}

async function createBlock({ startDate, endDate, reason }) {
  const { rows } = await pool.query(
    `INSERT INTO blocked_dates (start_date, end_date, reason)
     VALUES ($1,$2,$3) RETURNING *`,
    [startDate, endDate, reason || null],
  );
  return rows[0];
}

async function removeBlock(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM blocked_dates WHERE id = $1 AND booking_id IS NULL',
    [id],
  );
  return rowCount > 0;
}

module.exports = { findAllBlocked, findCalendarFeed, createBlock, removeBlock };
