import React, { useState } from 'react';
import { bookAppointment } from '../utils/api';
import './DateTimeSelect.css'; // Import the CSS for loading animation

function ConfirmationPage({ onPrev, appointmentData, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      // Set loading state to true
      setIsLoading(true);

      // Debug log
      console.log('Full appointment data:', JSON.stringify(appointmentData, null, 2));

      // Comprehensive validation
      const requiredFields = ['date', 'time', 'name', 'phone', 'location'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);
      
      if (missingFields.length > 0) {
        setIsLoading(false);
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Attempting to book appointment with data:', appointmentData);
      const response = await bookAppointment(appointmentData);
      
      if (response.success) {
        onSuccess();
      } else {
        setIsLoading(false);
        alert(response.error || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    }
  };

  // Add validation check in render to show what data is available
  console.log('Rendering confirmation page with data:', appointmentData);

  return (
    <div className="confirmation-page">
      <h2>Confirm Your Appointment</h2>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p>Processing your appointment...</p>
        </div>
      ) : (
        <>
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
            <button 
              className="back-button" 
              onClick={onPrev}
              disabled={isLoading}
            >
              Back
            </button>
            <button 
              className="confirm-button" 
              onClick={handleConfirm}
              disabled={isLoading}
            >
              Confirm Appointment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ConfirmationPage; 