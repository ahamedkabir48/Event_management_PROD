// Backend/models/Registration.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const registrationSchema = new Schema(
  {
    user:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true }
  },
  { timestamps: true }
);

// Prevent duplicate registrations by the same user for the same event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
