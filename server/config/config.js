const path = require('path');

const config = {
  development: {
    port: process.env.PORT || 5000,
    clientOrigin: 'http://localhost:3000',
    googleCredentialsPath: path.join(__dirname, 'google-credentials.json'),
    spreadsheetId: process.env.SPREADSHEET_ID
  },
  production: {
    port: process.env.PORT || 5000,
    clientOrigin: process.env.CLIENT_ORIGIN || 'https://your-netlify-app.netlify.app',
    googleCredentialsPath: path.join(__dirname, 'google-credentials.json'),
    spreadsheetId: process.env.SPREADSHEET_ID
  }
};

module.exports = config; 