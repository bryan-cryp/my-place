const express = require('express');
const { body, param } = require('express-validator');
const availabilityController = require('../controllers/availabilityController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public: greyed-out calendar + a specific date-range check
router.get('/', availabilityController.getPublicAvailability);
router.get('/check', availabilityController.checkAvailability);

// Admin: full calendar feed + manual blocks
router.get('/calendar', requireAuth, availabilityController.getAdminCalendar);

router.post(
  '/',
  requireAuth,
  [
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('reason').optional().isString().isLength({ max: 200 }),
  ],
  validate,
  availabilityController.createBlock,
);

router.delete('/:id', requireAuth, [param('id').isUUID()], validate, availabilityController.deleteBlock);

module.exports = router;
