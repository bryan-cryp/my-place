const pool = require('../config/db');

async function get() {
  const { rows } = await pool.query('SELECT * FROM villa_settings WHERE id = 1');
  return rows[0] || null;
}

async function update(fields) {
  const allowed = [
    'villa_description', 'contact_email', 'contact_phone', 'whatsapp_number',
    'check_in_time', 'check_out_time', 'amenities', 'policies', 'location_info',
  ];
  const sets = [];
  const params = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (allowed.includes(key)) {
      params.push(
        key === 'amenities' || key === 'policies' ? JSON.stringify(value) : value,
      );
      sets.push(`${key} = $${params.length}`);
    }
  });

  if (!sets.length) return get();

  const { rows } = await pool.query(
    `UPDATE villa_settings SET ${sets.join(', ')} WHERE id = 1 RETURNING *`,
    params,
  );
  return rows[0];
}

module.exports = { get, update };
