import React from 'react';
import { getAvailability } from '../utils/api';

function LocationSelect({ onNext, updateData, selectedLocation }) {
  const locations = [
    'Miami Beach',
    'Yeshiva',
    'North Miami Beach',
    'Aventura',
    'Surfside/Bal Harbour/Bay Harbour'
  ];

  const handleLocationSelect = async (location) => {
    try {
      console.log('Selected location:', location);
      
      // Get availability for this location
      const response = await getAvailability(location);
      console.log('Received availability:', response);
      
      // Update the appointment data with selected location
      if (typeof updateData === 'function') {
        updateData({ location });
      } else {
        console.error('updateData is not a function:', updateData);
      }
      
      // Move to next step
      onNext();
    } catch (error) {
      console.error('Error selecting location:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="location-select">
      <h2>Select your location</h2>
      <div className="location-list">
        {locations.map((location) => (
          <button
            key={location}
            className={`location-button ${selectedLocation === location ? 'selected' : ''}`}
            onClick={() => handleLocationSelect(location)}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationSelect; 