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

app.use(cors({
  origin: [
    'http://localhost:3000',                // Local development
    'https://snip-sync.onrender.com',       // Your Render backend URL
    'https://yanayscuts.netlify.app/', // Your Netlify URL
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 