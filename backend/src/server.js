const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const pool = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const localOriginPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: (origin, callback) => {
    // Vite may choose another port when 5173 is busy. Permit loopback origins
    // only in development; production remains limited to CORS_ORIGIN.
    const isLocalDevelopmentOrigin = env.nodeEnv !== 'production' && localOriginPattern.test(origin || '');
    if (!origin || env.corsOrigin.includes(origin) || isLocalDevelopmentOrigin) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS.');
    error.status = 403;
    return callback(error);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'my-place-api', time: new Date().toISOString() });
});

// Use this endpoint for deployment checks: unlike /health it confirms that
// the API can also reach PostgreSQL.
app.get('/api/ready', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'my-place-api', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/settings', settingsRoutes);

// A production build can be served by the API process, which keeps the whole
// site available at one localhost address. During frontend development Vite
// still runs independently on http://localhost:5173.
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      service: 'my-place-api',
      frontend: 'Run the frontend with npm.cmd run dev, then open http://localhost:5173.',
    });
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`My Place API listening on port ${env.port} [${env.nodeEnv}]`);
  });

  function shutdown(signal) {
    // eslint-disable-next-line no-console
    console.log(`${signal} received. Closing My Place API.`);
    server.close(() => pool.end().finally(() => process.exit(0)));
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}
