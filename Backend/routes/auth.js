// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    username = username.trim();
    email = String(email).toLowerCase().trim();
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, email, password: hash });
    return res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'User already exists' });
    }
    return res.status(400).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' }); // expiry best practice [24]
  return res.json({ token, username: user.username });
});



module.exports = router;
