// backend/routes/events.js
const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/events
 * @desc    Create a new event (only for logged-in users)
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, date, time, location, description } = req.body;

    // Validate required fields
    if (!title || !date || !time || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create event with user reference
    const newEvent = await Event.create({
      title: title.trim(),
      date,
      time,
      location: location.trim(),
      description,
      createdBy: req.user.id, // from middleware
    });

    return res.status(201).json(newEvent);
  } catch (err) {
    console.error('❌ Error creating event:', err.message);
    return res.status(500).json({ message: 'Failed to create event' });
  }
});

/**
 * @route   GET /api/events/getAll
 * @desc    Get all events (public)
 */
router.get('/getAll', async (_req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    return res.json(events);
  } catch (err) {
    console.error('❌ Error fetching events:', err.message);
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event details
 */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.json(event);
  } catch (err) {
    console.error('❌ Error fetching event:', err.message);
    return res.status(500).json({ message: 'Failed to fetch event' });
  }
});

module.exports = router;
