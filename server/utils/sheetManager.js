const { google } = require('googleapis');
const path = require('path');
const config = require('../config/config');
const credentials = config.google;

class SheetManager {
  constructor() {
    // Configure authentication
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Replace these with your actual sheet IDs
    this.appointmentsSheetId = '1NPuEdQ_9D6kHsj4ZkAyWOWB0p_ynnjRa9xh2PHHpJ0U';  // from the URL of your appointments sheet
    this.availabilitySheetId = '1MEGTO0UjpkkNIgIgikhdNmQ6WrznUwbng8V6JukEI7Q';  // from the URL of your availability sheet
  }

  async getSheets() {
    try {
      const authClient = await this.auth.getClient();
      return google.sheets({ version: 'v4', auth: authClient });
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.code === 'ERR_OSSL_UNSUPPORTED') {
        console.error('OpenSSL error - Please set NODE_OPTIONS=--openssl-legacy-provider in your environment');
        // Fall back to alternative method or return empty data
      }
      throw error;
    }
  }

  async saveAppointment(appointmentData) {
    try {
      console.log('1. Starting appointment booking for:', appointmentData);
      
      // Validate the incoming data
      if (!appointmentData || typeof appointmentData !== 'object') {
        console.error('Invalid appointment data:', appointmentData);
        return { success: false, error: 'Invalid appointment data' };
      }

      // Validate required fields
      const requiredFields = ['date', 'time', 'name', 'phone', 'location'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
      }

      const sheets = await this.getSheets();
      
      // Get sheet information to find the actual sheet name
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId: this.appointmentsSheetId
      });
      
      // Get the first sheet name
      const firstSheetName = sheetsInfo.data.sheets[0].properties.title;
      console.log(`Using sheet name: "${firstSheetName}" for appointment data`);
      
      // First check if the slot is already booked
      const existingAppointments = await this.getExistingAppointments(appointmentData.date);
      console.log('2. Existing appointments:', existingAppointments);
      
      const isSlotTaken = existingAppointments.some(appointment => 
        appointment[1] === appointmentData.time && 
        appointment[2] === appointmentData.location
      );

      if (isSlotTaken) {
        console.log('3. Slot is already taken');
        return { success: false, error: 'This time slot is already booked' };
      }

      console.log('4. About to update availability');
      // Update availability first
      const availabilityUpdated = await this.updateAvailabilityAfterBooking(
        appointmentData.date,
        appointmentData.time,
        appointmentData.location
      );

      console.log('5. Availability update result:', availabilityUpdated);

      if (!availabilityUpdated) {
        console.error('6. Failed to update availability');
        return { success: false, error: 'Failed to update availability' };
      }

      console.log('7. Saving appointment to sheet');
      // Then save the appointment
      const values = [
        [
          appointmentData.date,
          appointmentData.time,
          appointmentData.name,
          appointmentData.phone,
          appointmentData.location,
          appointmentData.address || '',
          appointmentData.additionalInfo || ''
        ]
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.appointmentsSheetId,
        range: `${firstSheetName}!A1:G1`, // Use correct sheet name and more specific range
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      console.log('8. Appointment saved successfully');
      return { success: true };
    } catch (error) {
      console.error('ERROR in saveAppointment:', error);
      return { success: false, error: error.message };
    }
  }

  async getExistingAppointments(date) {
    try {
      const sheets = await this.getSheets();
      
      // First get sheet information to find the actual sheet name
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId: this.appointmentsSheetId
      });
      
      // Get the first sheet name (most likely it's not exactly "Sheet1")
      const firstSheetName = sheetsInfo.data.sheets[0].properties.title;
      console.log(`Found first sheet name: "${firstSheetName}"`);
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.appointmentsSheetId,
        range: `${firstSheetName}!A1:G1000`, // Use more specific range with row limits
      });
      
      return (response.data.values || []).slice(1).filter(row => row[0] === date);
    } catch (error) {
      console.error('Error getting existing appointments:', error);
      return [];
    }
  }

  async updateAvailabilityAfterBooking(date, time, location) {
    try {
      const sheets = await this.getSheets();
      
      console.log('1. Starting update process for:', { date, time, location });

      // Get sheet information to find the actual sheet name
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId: this.availabilitySheetId
      });
      
      // Get the first sheet name
      const firstSheetName = sheetsInfo.data.sheets[0].properties.title;
      console.log(`Using sheet name: "${firstSheetName}" for availability updates`);

      // Get all availability data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.availabilitySheetId,
        range: `${firstSheetName}!A1:D1000`,
      });

      const values = response.data.values || [];
      console.log('2. Sheet data received. Number of rows:', values.length);

      // Find the row we want to update
      let targetRowIndex = -1;
      values.forEach((row, index) => {
        if (!row || row.length < 3) {
          console.log(`Skipping invalid row ${index}:`, row);
          return;
        }

        // Log raw values first
        console.log(`\nChecking row ${index}:`, {
          raw: {
            date: row[0],
            time: row[1],
            location: row[2],
            available: row[3]
          }
        });

        // Clean the data
        const rowDate = String(row[0]).trim();
        const rowTime = String(row[1]).trim();
        const rowLocation = String(row[2]).trim();
        const cleanLocation = String(location).trim();
        
        console.log('Cleaned values:', {
          rowDate, rowTime, rowLocation, cleanLocation,
          inputDate: date,
          inputTime: time
        });

        console.log('Comparison results:', {
          dateMatch: rowDate === date,
          timeMatch: rowTime === time,
          locationMatch: rowLocation === cleanLocation,
          typesOf: {
            rowDate: typeof rowDate,
            date: typeof date,
            rowTime: typeof rowTime,
            time: typeof time,
            rowLocation: typeof rowLocation,
            location: typeof location
          }
        });

        if (rowDate === date && rowTime === time && rowLocation === cleanLocation) {
          console.log(`✓ Match found at row ${index + 1}!`);
          targetRowIndex = index;
        }
      });

      if (targetRowIndex === -1) {
        console.error('❌ No matching row found. Search criteria:', {
          date,
          time,
          location,
          availableRows: values.map(row => ({
            date: row[0],
            time: row[1],
            location: row[2],
            available: row[3]
          }))
        });
        return false;
      }

      console.log(`🎯 Updating row ${targetRowIndex + 1}`);
      const range = `${firstSheetName}!D${targetRowIndex + 1}`;

      const updateResponse = await sheets.spreadsheets.values.update({
        spreadsheetId: this.availabilitySheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [['NO']]
        }
      });

      console.log('✅ Update complete:', updateResponse.data);
      return true;

    } catch (error) {
      console.error('❌ Error updating availability:', error);
      throw error;
    }
  }

  async getAvailability(location, date) {
    try {
      const sheets = await this.getSheets();
      
      // Get sheet information to find the actual sheet name
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId: this.availabilitySheetId
      });
      
      // Get the first sheet name
      const firstSheetName = sheetsInfo.data.sheets[0].properties.title;
      console.log(`Using sheet name: "${firstSheetName}" for availability data`);
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.availabilitySheetId,
        range: `${firstSheetName}!A1:D1000`, // Use correct sheet name and more specific range
      });

      console.log('Raw availability data:', response.data.values);
      return response.data.values || [];
    } catch (error) {
      console.error('Error reading availability:', error);
      return [];
    }
  }

  async updateAvailability(availabilityData) {
    try {
      const sheets = await this.getSheets();
      
      // Get sheet information to find the actual sheet name
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId: this.availabilitySheetId
      });
      
      // Get the first sheet name
      const firstSheetName = sheetsInfo.data.sheets[0].properties.title;
      console.log(`Using sheet name: "${firstSheetName}" for availability updates`);
      
      const values = [
        [
          availabilityData.date,
          availabilityData.time,
          availabilityData.available ? 'YES' : 'NO'
        ]
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.availabilitySheetId,
        range: `${firstSheetName}!A1:C1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Error updating availability:', error);
      return false;
    }
  }

  async setBarberAvailability(dates, times, location) {
    try {
      const sheets = await this.getSheets();
      
      // Get sheet information to find the actual sheet name
      const sheetsInfo = await sheets.spreadsheets.get({
        spreadsheetId: this.availabilitySheetId
      });
      
      // Get the first sheet name
      const firstSheetName = sheetsInfo.data.sheets[0].properties.title;
      console.log(`Using sheet name: "${firstSheetName}" for barber availability setup`);
      
      const values = dates.flatMap(date => 
        times.map(time => [date, time, location, 'YES'])
      );

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.availabilitySheetId,
        range: `${firstSheetName}!A1:D1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Error setting availability:', error);
      return false;
    }
  }
}

module.exports = new SheetManager(); 