import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    console.log('Restaurant proxy request:', req.body);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { endpoint, params } = req.body;
    
    if (!endpoint || !params) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Build query string from params object
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    // Make request to Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/${endpoint}?${queryParams.toString()}`;
    console.log('Requesting URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Google Places API response status:', data.status);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in restaurant proxy:', error);
    Sentry.captureException(error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}