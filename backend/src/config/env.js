const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseEnvFile(content) {
  const env = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) return;

    let [, key, value] = match;
    value = value.trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  });

  return env;
}

function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseEnvFile(content);

  Object.entries(parsed).forEach(([key, value]) => {
    if (process.env[key] === undefined) process.env[key] = value;
  });

  return parsed;
}

function loadEncryptedEnvFile(filePath, secretKey) {
  if (!secretKey || !fs.existsSync(filePath)) return false;

  try {
    const encryptedPayload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const key = crypto.createHash('sha256').update(secretKey).digest();
    const iv = Buffer.from(encryptedPayload.iv, 'hex');
    const authTag = Buffer.from(encryptedPayload.tag, 'hex');
    const ciphertext = Buffer.from(encryptedPayload.ciphertext, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');

    const parsed = parseEnvFile(decrypted);
    Object.entries(parsed).forEach(([key, value]) => {
      process.env[key] = value;
    });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not decrypt encrypted env file. Falling back to plain .env if present.');
    return false;
  }
}

const backendDir = path.resolve(__dirname, '../..');
const plainEnvPath = path.join(backendDir, '.env');
const encryptedEnvPath = path.join(backendDir, '.env.enc');
const secretKey = process.env.MY_PLACE_ENCRYPTION_KEY || process.env.APP_SECRET_KEY || process.env.BACKEND_SECRET_KEY;
const encryptedEnvExists = fs.existsSync(encryptedEnvPath);

if (secretKey && encryptedEnvExists) {
  if (!loadEncryptedEnvFile(encryptedEnvPath, secretKey)) {
    throw new Error('Unable to decrypt backend environment. Refusing to start.');
  }
} else if (encryptedEnvExists) {
  throw new Error('MY_PLACE_ENCRYPTION_KEY is required when backend/.env.enc exists.');
} else {
  require('dotenv').config({ path: plainEnvPath });
}

if (!process.env.DATABASE_URL && fs.existsSync(plainEnvPath)) {
  loadDotEnvFile(plainEnvPath);
}

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // eslint-disable-next-line no-console
    console.error(`FATAL: missing required environment variable ${name}`);
    process.exit(1);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '',
  contactEmail: process.env.CONTACT_EMAIL || '',
};

if (module.exports.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-change-me') {
    throw new Error('JWT_SECRET must be set to a unique secret in production.');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in production.');
  }
}
