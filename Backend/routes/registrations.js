// backend/routes/registrations.js (POST /api/registrations)
const express = require('express');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ message: 'eventId is required' });
  try {
    const reg = await Registration.create({ user: req.user.id, event: eventId });
    return res.status(201).json(reg);
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'Already registered' });
    return res.status(400).json({ message: 'Registration failed' });
  }
});

router.get('/mine', auth, async (req, res) => {
  const regs = await Registration.find({ user: req.user.id }).populate('event');
  return res.json(regs);
});

module.exports = router;
