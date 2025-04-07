const express = require('express');
const router = express.Router();
const sheetManager = require('../utils/sheetManager');

// Test route
router.get('/test', async (req, res) => {
  try {
    const availability = await sheetManager.getAvailability();
    console.log('Availability data:', availability);
    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error
    });
  }
});

// Add appointment
router.post('/book', async (req, res) => {
  try {
    console.log('Received booking request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({
        success: false,
        error: 'Invalid request body'
      });
    }

    // Validate required fields
    const requiredFields = ['date', 'time', 'name', 'phone', 'location'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    console.log('Calling sheetManager.saveAppointment with:', JSON.stringify(req.body, null, 2));
    const result = await sheetManager.saveAppointment(req.body);
    console.log('Booking result:', result);
    
    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.error || 'Failed to book appointment' 
      });
    }
  } catch (error) {
    console.error('Error in booking route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

module.exports = router; 