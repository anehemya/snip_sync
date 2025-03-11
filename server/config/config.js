const config = {
  google: process.env.GOOGLE_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
    : require('./google-credentials.json')
};

module.exports = config; 