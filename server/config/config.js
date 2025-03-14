const getGoogleCredentials = () => {
  try {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode');
      if (!process.env.GOOGLE_PRIVATE_KEY) {
        console.log('Missing GOOGLE_PRIVATE_KEY environment variable');
        throw new Error('Google credentials environment variables are not set');
      }

      // Clean and format the private key
      const privateKey = process.env.GOOGLE_PRIVATE_KEY
        .replace(/\\n/g, '\n')
        .replace(/"/g, '');  // Remove any quotes

      return {
        type: process.env.GOOGLE_CREDENTIALS_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
        token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
      };
    }
    
    // In development, use local credentials file
    return require('./google-credentials.json');
  } catch (error) {
    console.error('Error loading Google credentials:', error);
    throw error;
  }
};

const config = {
  google: getGoogleCredentials()
};

module.exports = config; 