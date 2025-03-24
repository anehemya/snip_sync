import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { getAvailability } from '../utils/api';
import "react-datepicker/dist/react-datepicker.css";

function DateTimeSelect({ onNext, onPrev, updateData, selectedDate, selectedTime, selectedLocation }) {
  const [availableTimes, setAvailableTimes] = useState([]);
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
      console.log('Raw availability data:', response.data);
      
      console.log('Selected Location:', selectedLocation);
      console.log('Available slots before filtering:', response.data.slice(1));
      console.log('Filtered slots:', response.data.slice(1).filter(slot => 
        console.log('Checking slot:', slot, {
          dateMatch: slot[0] === date,
          locationMatch: slot[2] === selectedLocation,
          isAvailable: slot[3] === 'YES',
          isValidTime: allTimeSlots.includes(slot[1])
        })
      ));
      
      // Skip the header row [0] and filter for the selected date, location and available slots
      const times = response.data
        .slice(1) // Skip header row
        .filter(slot => 
          slot[0] === date && // Match date
          slot[2] === selectedLocation && // Match location
          slot[3] === 'YES' && // Is available
          allTimeSlots.includes(slot[1]) // Is one of our time slots
        )
        .map(slot => slot[1]); // Get just the time

      // If no times available, find next available date
      if (times.length === 0) {
        // Get all future available dates
        const futureDates = response.data
          .slice(1)
          .filter(slot => {
            const slotDate = new Date(slot[0]);
            const currentDate = new Date(date);
            
            // Reset both dates to midnight for comparison
            slotDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            
            // If it's the same date, only include if there are available times
            if (slotDate.getTime() === currentDate.getTime()) {
              return false; // Skip current date since we already know it has no times
            }
            
            // Check if it's a future date with availability
            return slotDate.getTime() > currentDate.getTime() && 
                   slot[2] === selectedLocation && 
                   slot[3] === 'YES' && 
                   allTimeSlots.includes(slot[1]);
          })
          .map(slot => slot[0]); // Get just the dates

        // Sort dates and get the earliest one
        const sortedDates = [...new Set(futureDates)].sort((a, b) => {
          return new Date(a) - new Date(b);
        });

        console.log('Future available dates:', sortedDates);

        // Add one day to the next available date
        if (sortedDates[0]) {
          const nextDate = new Date(sortedDates[0]);
          nextDate.setDate(nextDate.getDate() + 1);  // Add one day
          setNextAvailableDate(formatDate(nextDate));
        } else {
          setNextAvailableDate(null);
        }
      } else {
        setNextAvailableDate(null);
      }

      console.log('Filtered available times:', times);
      setAvailableTimes(times);
      setError(null);
    } catch (err) {
      setError('Failed to load available times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, allTimeSlots, formatDate]);

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
        <div className="loading">Loading available times...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : availableTimes.length === 0 ? (
        <div className="no-times-message">
          <p>No times available on this date.</p>
          {nextAvailableDate && (
            <p>Next available date: {new Date(nextAvailableDate).toLocaleDateString()}</p>
          )}
        </div>
      ) : (
        <div className="time-slots">
          {allTimeSlots
            .filter(time24 => availableTimes.includes(time24))
            .map((time24) => (
              <button
                key={time24}
                className={`time-slot ${selectedTime === time24 ? 'selected' : ''}`}
                onClick={() => handleTimeSelect(time24)}
              >
                {formatDisplayTime(time24)}
              </button>
            ))}
        </div>
      )}

      <div className="navigation">
        <button className="back-button" onClick={onPrev}>Back</button>
      </div>
    </div>
  );
}

export default DateTimeSelect; 