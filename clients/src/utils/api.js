import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com'
  : 'http://localhost:5000';

export const api = {
  // Get available time slots
  getAvailability: async (location, date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/test`);
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
      const response = await axios.post(`${API_BASE_URL}/appointments/book`, appointmentData);
      console.log('Received booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in bookAppointment:', error);
      throw error;
    }
  }
}; 