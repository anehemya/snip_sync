import React from 'react';
import { bookAppointment } from '../utils/api';

function ConfirmationPage({ onPrev, appointmentData, onSuccess }) {
  const handleConfirm = async () => {
    try {
      // Debug log
      console.log('Full appointment data:', JSON.stringify(appointmentData, null, 2));

      // Comprehensive validation
      const requiredFields = ['date', 'time', 'name', 'phone', 'location'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);
      
      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Attempting to book appointment with data:', appointmentData);
      const response = await bookAppointment(appointmentData);
      
      if (response.success) {
        onSuccess();
      } else {
        alert(response.error || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    }
  };

  // Add validation check in render to show what data is available
  console.log('Rendering confirmation page with data:', appointmentData);

  return (
    <div className="confirmation-page">
      <h2>Confirm Your Appointment</h2>
      <div className="appointment-details">
        <h3>Appointment Details:</h3>
        <p><strong>Location:</strong> {appointmentData.location}</p>
        <p><strong>Date:</strong> {appointmentData.date}</p>
        <p><strong>Time:</strong> {appointmentData.time}</p>
        <h3>Personal Information:</h3>
        <p><strong>Name:</strong> {appointmentData.name}</p>
        <p><strong>Phone:</strong> {appointmentData.phone}</p>
        <p><strong>Address:</strong> {appointmentData.address}</p>
        {appointmentData.additionalInfo && (
          <p><strong>Additional Info:</strong> {appointmentData.additionalInfo}</p>
        )}
      </div>
      <div className="form-buttons">
        <button className="back-button" onClick={onPrev}>
          Back
        </button>
        <button className="confirm-button" onClick={handleConfirm}>
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage; 