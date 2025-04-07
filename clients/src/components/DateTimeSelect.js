import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { getAvailability } from '../utils/api';
import "react-datepicker/dist/react-datepicker.css";
import './DateTimeSelect.css'; // Make sure this import exists

function DateTimeSelect({ onNext, onPrev, updateData, selectedDate, selectedTime, selectedLocation }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const [nextAvailableDate, setNextAvailableDate] = useState(null);

  // Wrap allTimeSlots in useMemo to prevent unnecessary re-renders
  const allTimeSlots = useMemo(() => [
    '9:00', '9:15', '9:30', '9:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45',
    '22:00'
  ], []); // Empty dependency array since this never changes

  // Move formatDate to component level
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const loadAvailableTimes = useCallback(async (date) => {
    setLoading(true);
    try {
      const response = await getAvailability(selectedLocation, date);
      
      // Get all times for this date and location
      const daySlots = response.data
        .slice(1)
        .filter(slot => 
          slot[0] === date && 
          slot[2] === selectedLocation &&
          allTimeSlots.includes(slot[1])
        );

      // Separate into available and booked times
      const available = daySlots
        .filter(slot => slot[3] === 'YES')
        .map(slot => slot[1]);

      const booked = daySlots
        .filter(slot => slot[3] === 'NO')
        .map(slot => slot[1]);

      setAvailableTimes(available);
      setBookedTimes(booked);

      // If no available times, find next available date
      if (available.length === 0) {
        const futureDates = response.data
          .slice(1)
          .filter(slot => 
            slot[0] > date && 
            slot[2] === selectedLocation && 
            slot[3] === 'YES' && 
            allTimeSlots.includes(slot[1])
          )
          .map(slot => slot[0]);

        const sortedDates = [...new Set(futureDates)].sort();
        setNextAvailableDate(sortedDates[0] || null);
      } else {
        setNextAvailableDate(null);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load available times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, allTimeSlots]);

  useEffect(() => {
    if (currentDate) {
      loadAvailableTimes(formatDate(currentDate));
    }
  }, [currentDate, loadAvailableTimes, formatDate]);

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    updateData({ date: formatDate(date) });
  };

  const handleTimeSelect = (time) => {
    updateData({ time });
    onNext();
  };

  // const isTimeAvailable = (time) => {
  //   return availableTimes.includes(time);
  // };

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
        <div className="loading-container">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p>Loading available times...</p>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="time-slots">
            {allTimeSlots.map((time24) => {
              const isAvailable = availableTimes.includes(time24);
              const isBooked = bookedTimes.includes(time24);
              
              return (
                <button
                  key={time24}
                  className={`time-slot ${selectedTime === time24 ? 'selected' : ''} ${
                    isAvailable ? 'available' : ''
                  } ${isBooked ? 'booked' : ''}`}
                  onClick={() => isAvailable && handleTimeSelect(time24)}
                  disabled={!isAvailable}
                >
                  {formatDisplayTime(time24)}
                </button>
              );
            })}
          </div>
          
          {availableTimes.length === 0 && nextAvailableDate && (
            <div className="no-times-message">
              <p>No times available on this date.</p>
              <p>Next available date: {new Date(nextAvailableDate + 'T00:00:00').toLocaleDateString()}</p>
            </div>
          )}
        </>
      )}

      <div className="whatsapp-link">
        <a 
          href="https://wa.me/13057261246?text=Hi%20Yanay,%20I%20would%20like%20to%20request%20a%20custom%20time%20for%20my%20appointment."
          target="_blank"
          rel="noopener noreferrer"
        >
          For a custom time request, contact Yanay on WhatsApp
        </a>
      </div>

      <div className="navigation">
        <button className="back-button" onClick={onPrev}>Back</button>
      </div>
    </div>
  );
}

export default DateTimeSelect; 