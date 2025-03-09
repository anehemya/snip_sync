const ExcelJS = require('exceljs');
const path = require('path');

class ExcelManager {
  constructor() {
    this.appointmentsFile = path.join(__dirname, '../models/excel/appointments.xlsx');
    this.availabilityFile = path.join(__dirname, '../models/excel/availability.xlsx');
  }

  async saveAppointment(appointmentData) {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(this.appointmentsFile);
      const worksheet = workbook.getWorksheet('Appointments');
      
      worksheet.addRow({
        date: appointmentData.date,
        time: appointmentData.time,
        name: appointmentData.name,
        phone: appointmentData.phone,
        location: appointmentData.location,
        address: appointmentData.address,
        additionalInfo: appointmentData.additionalInfo
      });

      await workbook.xlsx.writeFile(this.appointmentsFile);
      return true;
    } catch (error) {
      console.error('Error saving appointment:', error);
      return false;
    }
  }

  async getAvailability(location, date) {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(this.availabilityFile);
      const worksheet = workbook.getWorksheet('Availability');
      // Implementation for reading availability
      return worksheet.getRows(2, worksheet.rowCount - 1);
    } catch (error) {
      console.error('Error reading availability:', error);
      return [];
    }
  }
}

module.exports = new ExcelManager(); 