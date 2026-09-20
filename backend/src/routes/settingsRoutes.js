const express = require('express');
const settingsController = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', settingsController.getSettings); // public: villa content, policies, contact info
router.put('/', requireAuth, settingsController.updateSettings);
router.get('/overview', requireAuth, settingsController.dashboardOverview);

module.exports = router;
