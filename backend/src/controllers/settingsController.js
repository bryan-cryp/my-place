const settingsModel = require('../models/settingsModel');
const galleryModel = require('../models/galleryModel');
const bookingModel = require('../models/bookingModel');
const inquiryModel = require('../models/inquiryModel');

async function getSettings(req, res, next) {
  try {
    const settings = await settingsModel.get();
    return res.json({ settings });
  } catch (err) {
    return next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const settings = await settingsModel.update(req.body);
    return res.json({ settings });
  } catch (err) {
    return next(err);
  }
}

async function dashboardOverview(req, res, next) {
  try {
    const [bookingStats, newInquiries, galleryCount] = await Promise.all([
      bookingModel.getStats(),
      inquiryModel.countNew(),
      galleryModel.count(),
    ]);
    return res.json({
      bookings: bookingStats,
      pendingInquiries: newInquiries,
      galleryImages: galleryCount,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getSettings, updateSettings, dashboardOverview };
