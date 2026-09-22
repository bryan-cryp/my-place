/**
 * One-off CLI to create (or reset) the villa's admin account.
 *
 * Usage (reads from .env, or pass flags to override):
 *   npm run create-admin
 *   npm run create-admin -- --email=you@example.com --password=Str0ngPass! --name="Villa Manager"
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
require('../config/env');
const pool = require('../config/db');
const adminModel = require('../models/adminModel');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach((arg) => {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  });
  return args;
}

async function main() {
  const args = parseArgs();
  const fullName = args.name || process.env.INITIAL_ADMIN_NAME || 'Villa Manager';
  const email = (args.email || process.env.INITIAL_ADMIN_EMAIL || '').toLowerCase().trim();
  const password = args.password || process.env.INITIAL_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Missing email or password. Set INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD in .env, or pass --email= --password=.');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const existing = await adminModel.findByEmail(email);
  if (existing) {
    console.log(`An admin with email ${email} already exists. No changes made.`);
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await adminModel.create({ fullName, email, passwordHash });

  console.log('Admin account created:');
  console.log(`  Name:  ${admin.full_name}`);
  console.log(`  Email: ${admin.email}`);
  console.log('You can now log in at /admin/login.');

  await pool.end();
}

main().catch((err) => {
  console.error('Failed to create admin:', err.message);
  process.exit(1);
});
