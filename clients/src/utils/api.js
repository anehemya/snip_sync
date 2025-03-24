import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get available time slots
export const getAvailability = async (location, date) => {
  try {
    const response = await api.get('/api/appointments/test');
    return response.data;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
};

// Book an appointment
export const bookAppointment = async (appointmentData) => {
  try {
    console.log('Sending booking request:', appointmentData);
    const response = await api.post('/api/appointments/book', appointmentData);
    console.log('Received booking response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    throw error;
  }
};

export const submitAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments`, {
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
}; 