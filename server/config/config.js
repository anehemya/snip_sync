const getGoogleCredentials = () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, construct credentials object from environment variables
      if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('Google credentials environment variables are not set');
      }
      
      return {
        type: process.env.GOOGLE_CREDENTIALS_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
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
    console.error('Error loading Google credentials:', error.message);
    throw error;
  }
};

const config = {
  google: getGoogleCredentials()
};

module.exports = config; 