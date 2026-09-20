const express = require('express');
const { body, param } = require('express-validator');
const galleryController = require('../controllers/galleryController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', galleryController.listImages);

router.post(
  '/',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('category').trim().notEmpty().withMessage('Category is required.'),
    body('imageUrl').isURL().withMessage('A valid image URL is required.'),
    body('displayOrder').optional().isInt(),
  ],
  validate,
  galleryController.createImage,
);

router.put(
  '/:id',
  requireAuth,
  [param('id').isUUID()],
  validate,
  galleryController.updateImage,
);

router.delete('/:id', requireAuth, [param('id').isUUID()], validate, galleryController.deleteImage);

module.exports = router;
