import React from 'react';
import { api } from '../utils/api';

function ConfirmationPage({ onPrev, appointmentData, onSuccess }) {
  const handleConfirm = async () => {
    try {
      console.log('Attempting to book appointment with data:', appointmentData);
      const response = await api.bookAppointment(appointmentData);
      console.log('Booking response:', response);
      if (response.success) {
        onSuccess();
      } else {
        alert(response.error || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

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