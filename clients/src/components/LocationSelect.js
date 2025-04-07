import React from 'react';

function LocationSelect({ onNext, updateData, selectedLocation }) {
  const locations = [
    'Miami Beach',
    'Yeshiva',
    'North Miami Beach',
    'Aventura',
    'Surfside/Bal Harbour/Bay Harbour'
  ];

  const handleLocationSelect = (location) => {
    // Update the appointment data with selected location
    if (typeof updateData === 'function') {
      updateData({ location });
    } else {
      console.error('updateData is not a function:', updateData);
    }
    
    // Move to next step immediately
    onNext();
  };

  return (
    <div className="location-select">
      <h2>Select your location</h2>
      <div className="location-list">
        {locations.map((location) => (
          <button
            key={location}
            className={`location-button`}
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