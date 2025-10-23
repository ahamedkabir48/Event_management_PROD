// backend/routes/registrations.js
const express = require('express');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/registrations
 * @desc    Register current user for an event
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) {
    return res.status(400).json({ message: 'eventId is required' });
  }

  try {
    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
    });

    return res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Already registered for this event' });
    }
    console.error('❌ Registration error:', err);
    return res.status(500).json({ message: 'Failed to register' });
  }
});

/**
 * @route   GET /api/registrations/mine
 * @desc    Get events registered by the current user
 * @access  Private
 */
router.get('/mine', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title date time location');

    return res.json(registrations);
  } catch (err) {
    console.error('❌ Fetch registration error:', err);
    return res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

module.exports = router;
