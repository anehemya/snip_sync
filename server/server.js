const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointmentRoutes');
const { google } = require('googleapis');
const credentials = require('./config/config').google;

// Add this for debugging
console.log('Starting server with credentials:', {
  type: credentials.type,
  project_id: credentials.project_id,
  client_email: credentials.client_email
  // Don't log private key or sensitive data
});

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://snip-sync.onrender.com',
  'https://yanayscuts.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
}));

// Routes
app.use('/api/appointments', appointmentRoutes);

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 