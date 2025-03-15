import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { useRestaurantContext } from '../context/RestaurantContext';
import RestaurantDetails from './RestaurantDetails';
import FilterOptions from './FilterOptions';

const RestaurantList = () => {
  const { restaurants, loading, selectedRestaurant, setSelectedRestaurant } = useRestaurantContext();
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 4,
    openNow: false
  });

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filter by rating
    if (restaurant.rating && restaurant.rating < filters.minRating) {
      return false;
    }
    
    // Filter by price
    if (restaurant.price_level !== undefined && restaurant.price_level > filters.maxPrice) {
      return false;
    }
    
    // Filter by open now
    if (filters.openNow && restaurant.opening_hours && !restaurant.opening_hours.open_now) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="p-4">
      {restaurants.length > 0 && (
        <FilterOptions filters={filters} updateFilters={updateFilters} />
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredRestaurants.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-3">
                {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''} trouvé{filteredRestaurants.length > 1 ? 's' : ''}
              </p>
              
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.place_id}
                  restaurant={restaurant}
                  onSelectRestaurant={handleSelectRestaurant}
                  isSelected={selectedRestaurant?.place_id === restaurant.place_id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              {restaurants.length > 0 ? (
                <p className="text-gray-600">
                  Aucun restaurant ne correspond aux filtres sélectionnés.
                </p>
              ) : (
                <p className="text-gray-600">
                  Recherchez des restaurants pour voir les résultats.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {selectedRestaurant && showDetails && (
        <RestaurantDetails 
          restaurant={selectedRestaurant} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default RestaurantList;