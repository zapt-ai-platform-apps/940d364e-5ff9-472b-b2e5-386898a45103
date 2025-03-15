import React from 'react';
import { FaStar, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';

const RestaurantCard = ({ restaurant, onSelectRestaurant, isSelected }) => {
  // Determine price level display
  const renderPriceLevel = () => {
    if (restaurant.price_level === undefined) return null;
    
    const eurosSymbols = [];
    for (let i = 0; i < restaurant.price_level; i++) {
      eurosSymbols.push(<FaEuroSign key={i} className="text-gray-600" />);
    }
    
    return (
      <div className="flex items-center">
        <span className="sr-only">Niveau de prix: {restaurant.price_level}</span>
        {eurosSymbols}
      </div>
    );
  };

  // Format rating display
  const renderRating = () => {
    if (!restaurant.rating) return 'Aucun avis';
    
    return (
      <div className="flex items-center">
        <FaStar className="text-yellow-400 mr-1" />
        <span>{restaurant.rating.toFixed(1)}</span>
        {restaurant.user_ratings_total && (
          <span className="text-gray-500 text-xs ml-1">
            ({restaurant.user_ratings_total})
          </span>
        )}
      </div>
    );
  };

  // Determine if restaurant is open
  const isOpen = restaurant.opening_hours?.open_now;

  return (
    <div 
      onClick={() => onSelectRestaurant(restaurant)}
      className={`restaurant-card p-4 mb-3 rounded-lg shadow-sm cursor-pointer transition-all ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{restaurant.name}</h3>
        {renderPriceLevel()}
      </div>
      
      <div className="text-sm text-gray-600 mb-2 flex items-center">
        <FaMapMarkerAlt className="mr-1 text-gray-400" />
        <span>{restaurant.vicinity}</span>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        {renderRating()}
        
        {isOpen !== undefined && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isOpen ? 'Ouvert' : 'Fermé'}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;