import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  // Get available time slots
  getAvailability: async (location, date) => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/test`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  // Book an appointment
  bookAppointment: async (appointmentData) => {
    try {
      console.log('Sending booking request:', appointmentData);
      const response = await axios.post(`${API_URL}/api/appointments/book`, appointmentData);
      console.log('Received booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in bookAppointment:', error);
      throw error;
    }
  },

  submitAppointment: async (appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}; 