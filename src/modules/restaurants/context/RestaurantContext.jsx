import React, { createContext, useContext, useState } from 'react';
import { searchRestaurants } from '../api/placesApi';
import * as Sentry from '@sentry/browser';

const RestaurantContext = createContext();

export const useRestaurantContext = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRestaurantsNearby = async (location) => {
    try {
      setIsSearching(true);
      setLoading(true);
      
      // Clear previous results
      setRestaurants([]);
      
      // Perform the search
      const results = await searchRestaurants(location);
      
      setRestaurants(results);
      console.log(`Found ${results.length} restaurants`);
      
      // Reset selected restaurant when searching in a new location
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Error searching for restaurants:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        setRestaurants,
        selectedRestaurant,
        setSelectedRestaurant,
        searchLocation,
        setSearchLocation,
        loading,
        isSearching,
        searchRestaurantsNearby
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};