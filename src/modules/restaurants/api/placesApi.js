import axios from 'axios';
import * as Sentry from '@sentry/browser';

const CORS_PROXY = '/api/restaurantProxy';

export const searchRestaurants = async (location, radius = 1500, type = 'restaurant') => {
  try {
    console.log('Searching restaurants near:', location);
    
    // Using browser's fetch with our proxy API
    const response = await fetch(`${CORS_PROXY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'nearbysearch/json',
        params: {
          location: `${location.lat},${location.lng}`,
          radius: radius,
          type: type,
          key: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      })
    });
    
    const data = await response.json();
    console.log('Restaurant search results:', data);
    
    if (data.status !== 'OK') {
      throw new Error(`Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    return data.results || [];
  } catch (error) {
    console.error('Error searching restaurants:', error);
    Sentry.captureException(error);
    return [];
  }
};

export const getRestaurantDetails = async (placeId) => {
  try {
    console.log('Fetching details for restaurant ID:', placeId);
    
    const response = await fetch(`${CORS_PROXY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'details/json',
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,formatted_phone_number,rating,reviews,photos,opening_hours,website,price_level,user_ratings_total',
          key: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      })
    });
    
    const data = await response.json();
    console.log('Restaurant details response:', data);
    
    if (data.status !== 'OK') {
      throw new Error(`Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    Sentry.captureException(error);
    return null;
  }
};