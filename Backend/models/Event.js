// backend/models/Event.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    // Store date and time separately (string) or merge into a Date in your controller
    date: { type: String, required: true },      // e.g., "2025-09-13"
    time: { type: String, required: true },      // e.g., "14:30"
    location: { type: String, required: true, trim: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
