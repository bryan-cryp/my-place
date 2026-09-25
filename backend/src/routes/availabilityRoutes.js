const express = require('express');
const { body, param } = require('express-validator');
const availabilityController = require('../controllers/availabilityController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const isLaterDate = (value, { req }) => new Date(value) > new Date(req.body.startDate);

// Public: greyed-out calendar + a specific date-range check
router.get('/', availabilityController.getPublicAvailability);
router.get(
  '/check',
  [
    require('express-validator').query('checkIn').isISO8601().withMessage('checkIn must be a valid date.'),
    require('express-validator').query('checkOut').isISO8601()
      .custom((value, { req }) => new Date(value) > new Date(req.query.checkIn))
      .withMessage('checkOut must be after checkIn.'),
  ],
  validate,
  availabilityController.checkAvailability,
);

// Admin: full calendar feed + manual blocks
router.get('/calendar', requireAuth, availabilityController.getAdminCalendar);

router.post(
  '/',
  requireAuth,
  [
    body('startDate').isISO8601().withMessage('startDate must be a valid date.'),
    body('endDate').isISO8601().custom(isLaterDate).withMessage('endDate must be after startDate.'),
    body('reason').optional().isString().isLength({ max: 200 }),
  ],
  validate,
  availabilityController.createBlock,
);

router.delete('/:id', requireAuth, [param('id').isUUID()], validate, availabilityController.deleteBlock);

module.exports = router;
