const express = require('express');
const { body, param, query } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const bookingTypes = ['holiday', 'honeymoon', 'family_stay', 'group_stay', 'long_stay', 'other'];
const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

// Public: submit an inquiry/booking request
router.post(
  '/',
  formLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone number is required.'),
    body('checkIn').isISO8601().withMessage('Check-in date is required (YYYY-MM-DD).'),
    body('checkOut').isISO8601().withMessage('Check-out date is required (YYYY-MM-DD).')
      .custom((value, { req }) => new Date(value) > new Date(req.body.checkIn))
      .withMessage('Check-out date must be after check-in date.'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult is required.'),
    body('children').optional().isInt({ min: 0 }),
    body('bookingType').isIn(bookingTypes).withMessage('Invalid booking type.'),
    body('airportTransfer').optional().isBoolean(),
    body('message').optional().isString().isLength({ max: 2000 }),
  ],
  validate,
  bookingController.createBooking,
);

// Admin: list, stats, detail, update, delete
router.get('/stats', requireAuth, bookingController.stats);

router.get(
  '/',
  requireAuth,
  [
    query('status').optional().isIn(statuses),
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  bookingController.listBookings,
);

router.get('/:id', requireAuth, [param('id').isUUID()], validate, bookingController.getBooking);

router.put(
  '/:id',
  requireAuth,
  [
    param('id').isUUID(),
    body('status').optional().isIn(statuses),
    body('adminNotes').optional().isString().isLength({ max: 5000 }),
    body('checkIn').optional().isISO8601(),
    body('checkOut').optional().isISO8601(),
    body('adults').optional().isInt({ min: 1 }),
    body('children').optional().isInt({ min: 0 }),
    body('bookingType').optional().isIn(bookingTypes),
    body('airportTransfer').optional().isBoolean(),
  ],
  validate,
  bookingController.updateBooking,
);

router.delete('/:id', requireAuth, [param('id').isUUID()], validate, bookingController.deleteBooking);

module.exports = router;
