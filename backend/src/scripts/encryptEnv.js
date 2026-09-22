const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const backendDir = path.resolve(__dirname, '../..');
const envPath = path.join(backendDir, '.env');
const outPath = path.join(backendDir, '.env.enc');
const secretKey = process.env.MY_PLACE_ENCRYPTION_KEY || process.env.APP_SECRET_KEY || process.env.BACKEND_SECRET_KEY;

if (!secretKey) {
  console.error('Missing encryption key. Set MY_PLACE_ENCRYPTION_KEY, APP_SECRET_KEY, or BACKEND_SECRET_KEY before encrypting.');
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  console.error(`Environment file not found at ${envPath}. Copy backend/.env.example to backend/.env first.`);
  process.exit(1);
}

const plainEnv = fs.readFileSync(envPath, 'utf8');
const key = crypto.createHash('sha256').update(secretKey).digest();
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(plainEnv, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();

const payload = {
  iv: iv.toString('hex'),
  ciphertext: ciphertext.toString('hex'),
  tag: tag.toString('hex'),
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`Encrypted environment written to ${outPath}`);
console.log('Keep the same secret key in your deployment environment or this file will not decrypt.');
