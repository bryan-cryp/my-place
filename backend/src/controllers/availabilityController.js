const availabilityModel = require('../models/availabilityModel');
const bookingModel = require('../models/bookingModel');

async function getPublicAvailability(req, res, next) {
  try {
    // Public feed only needs date ranges to grey out a calendar — no guest details.
    const feed = await availabilityModel.findCalendarFeed();
    const ranges = feed.map((r) => ({ startDate: r.start_date, endDate: r.end_date }));
    return res.json({ blockedRanges: ranges });
  } catch (err) {
    return next(err);
  }
}

async function getAdminCalendar(req, res, next) {
  try {
    const feed = await availabilityModel.findCalendarFeed();
    return res.json({ events: feed });
  } catch (err) {
    return next(err);
  }
}

async function checkAvailability(req, res, next) {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'checkIn and checkOut query params are required.' });
    }
    const conflict = await bookingModel.hasConflict(checkIn, checkOut);
    return res.json({ available: !conflict });
  } catch (err) {
    return next(err);
  }
}

async function createBlock(req, res, next) {
  try {
    const { startDate, endDate, reason } = req.body;
    const block = await availabilityModel.createBlock({ startDate, endDate, reason });
    return res.status(201).json({ block });
  } catch (err) {
    return next(err);
  }
}

async function deleteBlock(req, res, next) {
  try {
    const removed = await availabilityModel.removeBlock(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Block not found or it belongs to a booking.' });
    }
    return res.json({ message: 'Block removed.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getPublicAvailability, getAdminCalendar, checkAvailability, createBlock, deleteBlock,
};
