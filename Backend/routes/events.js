// backend/routes/events.js
const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/events -> create an event
router.post('/', auth, async (req, res) => {
  try {
    let { title, date, time, location, description } = req.body;
    if (!title || !date || !time || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    title = String(title).trim();
    location = String(location).trim();

    const evt = await Event.create({ title, date, time, location, description });
    return res.status(201).json(evt);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create event' });
  }
});

// GET /api/events/getAll -> list events
router.get('/getAll', async (_req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  return res.json(events);
});

// GET /api/events/:id -> single event
router.get('/:id', async (req, res) => {
  const evt = await Event.findById(req.params.id);
  if (!evt) return res.status(404).json({ message: 'Event not found' });
  return res.json(evt);
});

module.exports = router;
