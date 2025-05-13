import React, { useState } from 'react';

function LocationSelect({ onNext, updateData, selectedLocation }) {
  const [showPriceList, setShowPriceList] = useState(false);
  
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

  const togglePriceList = () => {
    setShowPriceList(!showPriceList);
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
      
      <button 
        className="price-list-button" 
        onClick={togglePriceList}
      >
        View Price List
      </button>
      
      {showPriceList && (
        <div className="price-list-modal">
          <div className="price-list-content">
            <span className="close-button" onClick={togglePriceList}>&times;</span>
            <h2 className="price-list-title">PRICE LIST</h2>
            <h3 className="price-list-subtitle">BARBER SERVICES</h3>
            
            <div className="price-list-items">
              <div className="price-item">
                <span className="service">HAIRCUT</span>
                <span className="price">$50</span>
              </div>
              <div className="price-item">
                <span className="service">BEARD TRIM</span>
                <span className="price">$10</span>
              </div>
              <div className="price-item">
                <span className="service">*UPSHERIN/CHALAKE</span>
                <span className="price">$65</span>
              </div>
            </div>
            
            <p className="family-discount">
              Family Discount: 3 or more haircuts in one location at $40 a haircut
            </p>
            
            <p className="additional-fee">
              *$15 FEE FOR EVERY ADDITIONAL 30 MINS. AFTER THE FIRST HOUR
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationSelect; 