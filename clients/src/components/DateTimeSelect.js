import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { api } from '../utils/api';
import "react-datepicker/dist/react-datepicker.css";

function DateTimeSelect({ onNext, onPrev, updateData, selectedDate, selectedTime }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  // Update time slots to 24-hour format to match Google Sheet
  const allTimeSlots = ['18:00', '18:45', '19:30'];  // 6:00 PM, 6:45 PM, 7:30 PM

  // Add this function to convert 24h to 12h format
  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Add this function to convert 12h to 24h format
  const convertTo24Hour = (time12) => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    
    if (hours === 12) {
      hours = modifier === 'PM' ? 12 : 0;
    } else {
      hours = modifier === 'PM' ? hours + 12 : hours;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  useEffect(() => {
    if (currentDate) {
      loadAvailableTimes(formatDate(currentDate));
    }
  }, [currentDate]);

  const formatDate = (date) => {
    // Format date as YYYY-MM-DD to match Google Sheet format
    return date.toISOString().split('T')[0];
  };

  const loadAvailableTimes = async (date) => {
    setLoading(true);
    try {
      const response = await api.getAvailability(null, date);
      console.log('Raw availability data:', response.data);
      
      // Skip the header row [0] and filter for the selected date and available slots
      const times = response.data
        .slice(1) // Skip header row
        .filter(slot => 
          slot[0] === date && // Match date
          slot[3] === 'YES' && // Is available
          allTimeSlots.includes(slot[1]) // Is one of our time slots
        )
        .map(slot => slot[1]); // Get just the time

      console.log('Filtered available times:', times);
      setAvailableTimes(times);
      setError(null);
    } catch (err) {
      setError('Failed to load available times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    updateData({ date: formatDate(date) });
  };

  const handleTimeSelect = (time) => {
    updateData({ time });
    onNext();
  };

  const isTimeAvailable = (time) => {
    return availableTimes.includes(time);
  };

  const formatDisplayTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="datetime-select">
      <h2>Select your time</h2>
      
      <div className="calendar-container">
        <DatePicker
          selected={currentDate}
          onChange={handleDateSelect}
          inline
          minDate={new Date()}
          calendarClassName="custom-calendar"
        />
      </div>

      {loading ? (
        <div className="loading">Loading available times...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="time-slots">
          {allTimeSlots.map((time24) => {
            return (
              <button
                key={time24}
                className={`time-slot ${selectedTime === time24 ? 'selected' : ''} ${
                  !availableTimes.includes(time24) ? 'unavailable' : ''
                }`}
                onClick={() => availableTimes.includes(time24) && handleTimeSelect(time24)}
                disabled={!availableTimes.includes(time24)}
              >
                {formatDisplayTime(time24)}
              </button>
            )}
          )}
        </div>
      )}

      <div className="navigation">
        <button className="back-button" onClick={onPrev}>Back</button>
      </div>
    </div>
  );
}

export default DateTimeSelect; 