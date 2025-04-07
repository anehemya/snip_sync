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

// 1. Configure CORS first
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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Then body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Debug middleware
app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// 4. Routes
app.use('/api/appointments', appointmentRoutes);

// 5. Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 