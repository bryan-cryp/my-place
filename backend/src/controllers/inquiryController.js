const inquiryModel = require('../models/inquiryModel');

async function createInquiry(req, res, next) {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    const inquiry = await inquiryModel.create({ fullName, email, phone, subject, message });
    return res.status(201).json({ inquiry });
  } catch (err) {
    return next(err);
  }
}

async function listInquiries(req, res, next) {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;
    const limit = Math.min(Number(pageSize) || 20, 100);
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const [inquiries, total] = await Promise.all([
      inquiryModel.findAll({ status, limit, offset }),
      inquiryModel.count({ status }),
    ]);

    return res.json({ inquiries, total, page: Number(page), pageSize: limit });
  } catch (err) {
    return next(err);
  }
}

async function getInquiry(req, res, next) {
  try {
    const inquiry = await inquiryModel.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found.' });
    return res.json({ inquiry });
  } catch (err) {
    return next(err);
  }
}

async function updateInquiry(req, res, next) {
  try {
    const { status, adminNotes } = req.body;
    const updated = await inquiryModel.update(req.params.id, { status, adminNotes });
    if (!updated) return res.status(404).json({ error: 'Inquiry not found.' });
    return res.json({ inquiry: updated });
  } catch (err) {
    return next(err);
  }
}

async function deleteInquiry(req, res, next) {
  try {
    const removed = await inquiryModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Inquiry not found.' });
    return res.json({ message: 'Inquiry deleted.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createInquiry, listInquiries, getInquiry, updateInquiry, deleteInquiry };
