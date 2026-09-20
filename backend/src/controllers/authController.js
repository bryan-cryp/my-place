const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findByEmail(email.toLowerCase().trim());

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const matches = await bcrypt.compare(password, admin.password_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    );

    return res.json({
      token,
      admin: { id: admin.id, fullName: admin.full_name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    return next(err);
  }
}

// Stateless JWT: logout is handled client-side by discarding the token.
// This endpoint exists for a consistent API surface and future session-based upgrades.
function logout(req, res) {
  res.json({ message: 'Logged out.' });
}

async function me(req, res, next) {
  try {
    const admin = await adminModel.findById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin account not found.' });
    return res.json({ admin });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, logout, me };
