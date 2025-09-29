const express = require('express');
require('dotenv').config();

const app = express();

// Connect to MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// Middleware
app.use(express.json());

// Example health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Your other routes...
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
