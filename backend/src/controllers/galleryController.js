const galleryModel = require('../models/galleryModel');

async function listImages(req, res, next) {
  try {
    const { category } = req.query;
    const images = await galleryModel.findAll(category);
    return res.json({ images });
  } catch (err) {
    return next(err);
  }
}

async function createImage(req, res, next) {
  try {
    const { title, category, imageUrl, displayOrder } = req.body;
    const image = await galleryModel.create({ title, category, imageUrl, displayOrder });
    return res.status(201).json({ image });
  } catch (err) {
    return next(err);
  }
}

async function updateImage(req, res, next) {
  try {
    const image = await galleryModel.update(req.params.id, req.body);
    if (!image) return res.status(404).json({ error: 'Image not found.' });
    return res.json({ image });
  } catch (err) {
    return next(err);
  }
}

async function deleteImage(req, res, next) {
  try {
    const removed = await galleryModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Image not found.' });
    return res.json({ message: 'Image deleted.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listImages, createImage, updateImage, deleteImage };
