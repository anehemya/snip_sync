const getGoogleCredentials = () => {
  try {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Raw GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'exists' : 'undefined');
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode');
      
      // Log environment variable presence (not values)
      console.log('Environment variables check:', {
        GOOGLE_CREDENTIALS_TYPE: !!process.env.GOOGLE_CREDENTIALS_TYPE,
        GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
        GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
        GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
        GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
        GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID
      });

      if (!process.env.GOOGLE_PRIVATE_KEY) {
        console.log('Missing GOOGLE_PRIVATE_KEY environment variable');
        throw new Error('Google credentials environment variables are not set');
      }

      // Clean and format the private key
      const privateKey = process.env.GOOGLE_PRIVATE_KEY
        .replace(/\\n/g, '\n')    // Replace double backslash with newline
        .replace(/"/g, '');       // Remove quotes

      // Add more detailed debugging
      console.log('Private key format:', {
        beforeProcessing: process.env.GOOGLE_PRIVATE_KEY.substring(0, 30),
        afterProcessing: privateKey.substring(0, 30),
        backslashCount: (process.env.GOOGLE_PRIVATE_KEY.match(/\\/g) || []).length,
        containsNewlines: privateKey.includes('\n'),
        startsWithBegin: privateKey.startsWith('-----BEGIN')
      });

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

