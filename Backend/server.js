require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());                   
connectDB();                               

//app.use('/api/users', require('./routes/userRoutes'));
//app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/auth', require('./routes/auth'));   // mounts /api/auth/* routes
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));



app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


// keep any catch‑all last
app.all('*', (_req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//app.listen(5000, () => console.log('API http://localhost:5000'));
