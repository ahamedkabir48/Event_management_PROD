const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
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
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Prevent duplicate registration
    const existing = await Registration.findOne({
      user: req.user.id,
      event: eventId,
    });

    if (existing) {
      return res.status(409).json({ message: 'Already registered for this event' });
    }

    // Create new registration
    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
    });

    return res.status(201).json({
      message: 'Registered successfully',
      registration,
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ message: 'Failed to register' });
  }
});

/**
 * @route   GET /api/registrations/mine
 * @desc    Get all events the current user registered for
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

/**
 * @route   GET /api/registrations/:eventId
 * @desc    Get list of users registered for a specific event (for admin/creator)
 * @access  Private
 */
router.get('/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only event creator or admin should view registered users
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view registrations' });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'username email');

    return res.json({
      event: event.title,
      totalRegistrations: registrations.length,
      users: registrations.map((r) => r.user),
    });
  } catch (err) {
    console.error('❌ Error fetching registrations:', err);
    return res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

module.exports = router;
