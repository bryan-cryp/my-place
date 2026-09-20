const bookingModel = require('../models/bookingModel');

async function createBooking(req, res, next) {
  try {
    const {
      fullName, email, phone, whatsappNumber, checkIn, checkOut,
      adults, children, bookingType, airportTransfer, message,
    } = req.body;

    const conflict = await bookingModel.hasConflict(checkIn, checkOut);
    if (conflict) {
      return res.status(409).json({
        error: 'Those dates are no longer available. Please choose different dates.',
      });
    }

    const booking = await bookingModel.create({
      fullName, email, phone, whatsappNumber, checkIn, checkOut,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      bookingType, airportTransfer, message,
    });

    return res.status(201).json({ booking });
  } catch (err) {
    return next(err);
  }
}

async function listBookings(req, res, next) {
  try {
    const { status, search, page = 1, pageSize = 20 } = req.query;
    const limit = Math.min(Number(pageSize) || 20, 100);
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const [bookings, total] = await Promise.all([
      bookingModel.findAll({ status, search, limit, offset }),
      bookingModel.count({ status, search }),
    ]);

    return res.json({ bookings, total, page: Number(page), pageSize: limit });
  } catch (err) {
    return next(err);
  }
}

async function getBooking(req, res, next) {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    return res.json({ booking });
  } catch (err) {
    return next(err);
  }
}

async function updateBooking(req, res, next) {
  try {
    const existing = await bookingModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Booking not found.' });

    const updated = await bookingModel.update(req.params.id, req.body);
    return res.json({ booking: updated });
  } catch (err) {
    return next(err);
  }
}

async function deleteBooking(req, res, next) {
  try {
    const removed = await bookingModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Booking not found.' });
    return res.json({ message: 'Booking deleted.' });
  } catch (err) {
    return next(err);
  }
}

async function stats(req, res, next) {
  try {
    const data = await bookingModel.getStats();
    return res.json({ stats: data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createBooking, listBookings, getBooking, updateBooking, deleteBooking, stats,
};
