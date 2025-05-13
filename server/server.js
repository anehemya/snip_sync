
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
  'https://www.yanayscuts.netlify.app'
];

// 1. Configure CORS first
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Referer', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// 2. Security headers middleware
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 3. Then body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Debug middleware
app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    referer: req.headers.referer,
    body: req.body,
    headers: req.headers
  });
  next();
});

// 5. Routes
app.use('/api/appointments', appointmentRoutes);

// 6. Error handling
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