const express = require('express');
const { body, param, query } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();
const statuses = ['new', 'read', 'contacted'];

router.post(
  '/',
  formLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('phone').optional().isString(),
    body('subject').optional().isString().isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required.').isLength({ max: 2000 }),
  ],
  validate,
  inquiryController.createInquiry,
);

router.get(
  '/',
  requireAuth,
  [query('status').optional().isIn(statuses)],
  validate,
  inquiryController.listInquiries,
);

router.get('/:id', requireAuth, [param('id').isUUID()], validate, inquiryController.getInquiry);

router.put(
  '/:id',
  requireAuth,
  [param('id').isUUID(), body('status').optional().isIn(statuses)],
  validate,
  inquiryController.updateInquiry,
);

router.delete('/:id', requireAuth, [param('id').isUUID()], validate, inquiryController.deleteInquiry);

module.exports = router;
