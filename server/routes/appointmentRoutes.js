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
    console.log('Received booking request:', req.body);
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
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 