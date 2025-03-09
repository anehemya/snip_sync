import React from 'react';

function SuccessPage({ appointmentData }) {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h2>Appointment Confirmed!</h2>
      <div className="success-details">
        <p>Thank you for booking with us, {appointmentData.name}!</p>
        <div className="appointment-summary">
          <h3>Your Appointment Details:</h3>
          <p><strong>Date:</strong> {appointmentData.date}</p>
          <p><strong>Time:</strong> {appointmentData.time}</p>
          <p><strong>Location:</strong> {appointmentData.location}</p>
        </div>
        <div className="confirmation-message">
          <p>A confirmation has been sent to your phone.</p>
          <p>See you soon!</p>
        </div>
      </div>
      <button 
        className="new-appointment-button"
        onClick={() => window.location.reload()}
      >
        Book Another Appointment
      </button>
    </div>
  );
}

export default SuccessPage; 