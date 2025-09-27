const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
