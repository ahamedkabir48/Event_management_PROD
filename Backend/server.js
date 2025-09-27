require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());                   // must be before routes
connectDB();                               // mongoose.connect inside db.js


app.use('/api/auth', require('./routes/auth'));   // mounts /api/auth/* routes
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

// keep any catch‑all last
app.all('*', (_req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(5000, () => console.log('API http://localhost:5000'));
