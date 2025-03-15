import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUtensils } from 'react-icons/fa';
import { useRestaurantContext } from '../context/RestaurantContext';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import * as Sentry from '@sentry/browser';

const SearchContainer = () => {
  const { searchLocation, setSearchLocation, searchRestaurantsNearby, isSearching } = useRestaurantContext();
  const [localSearchValue, setLocalSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ['(cities)'] },
    debounce: 300,
  });

  useEffect(() => {
    // Initialize with empty value
    setValue('');
  }, [setValue]);

  const handleSelect = async (suggestion) => {
    setValue(suggestion.description, false);
    setLocalSearchValue(suggestion.description);
    clearSuggestions();
    setShowSuggestions(false);
    
    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("Selected location coordinates:", { lat, lng });
      
      setSearchLocation({ lat, lng });
      searchRestaurantsNearby({ lat, lng });
    } catch (error) {
      console.error("Error selecting location:", error);
      Sentry.captureException(error);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setLocalSearchValue(newValue);
    
    if (newValue) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (data.length > 0) {
      handleSelect(data[0]);
    }
  };

  return (
    <div className="p-4 bg-white search-container">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-300 transition">
          <div className="px-3 py-2 bg-blue-50">
            <FaUtensils className="text-blue-500" />
          </div>
          
          <input
            type="text"
            placeholder="Rechercher des restaurants à..."
            value={localSearchValue}
            onChange={handleInputChange}
            className="w-full py-2 px-3 focus:outline-none box-border"
            disabled={!ready}
          />
          
          <button 
            type="submit"
            disabled={isSearching || !localSearchValue}
            className={`px-4 py-2 ${
              isSearching || !localSearchValue 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            } text-white transition`}
          >
            {isSearching ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <FaSearch />
            )}
          </button>
        </div>
        
        {showSuggestions && status === "OK" && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            {data.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchContainer;