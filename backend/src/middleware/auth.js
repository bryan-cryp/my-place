const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

/**
 * Reads the JWT from the Authorization header ("Bearer <token>"),
 * verifies it, and attaches the decoded admin payload to req.admin.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

module.exports = { requireAuth };
