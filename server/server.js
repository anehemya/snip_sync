const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',                // Local development
    'https://snip-sync.onrender.com',       // Your Render backend URL
    // Add your Netlify URL once you have it
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 