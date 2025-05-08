import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
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
    if (!appointmentData) {
      throw new Error('No appointment data provided');
    }

    const payload = {
      date: appointmentData.date,
      time: appointmentData.time,
      name: appointmentData.name,
      phone: appointmentData.phone,
      location: appointmentData.location,
      address: appointmentData.address || '',
      additionalInfo: appointmentData.additionalInfo || ''
    };

    console.log('Sending booking request with payload:', JSON.stringify(payload, null, 2));

    const response = await api.post('/api/appointments/book', payload);

    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      request: {
        url: error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });

    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to book appointment');
    }
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