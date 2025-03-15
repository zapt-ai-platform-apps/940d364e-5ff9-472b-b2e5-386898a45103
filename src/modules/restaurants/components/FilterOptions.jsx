import React from 'react';
import { FaStar, FaEuroSign } from 'react-icons/fa';

const FilterOptions = ({ filters, updateFilters }) => {
  const handleRatingChange = (value) => {
    updateFilters({ minRating: value });
  };

  const handlePriceChange = (value) => {
    updateFilters({ maxPrice: value });
  };

  const handleOpenNowChange = (e) => {
    updateFilters({ openNow: e.target.checked });
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filtres</h3>
      
      <div className="space-y-3">
        {/* Rating filter */}
        <div>
          <label className="text-xs text-gray-600 flex items-center mb-1">
            Note minimum <FaStar className="text-yellow-400 ml-1" />
          </label>
          
          <div className="flex items-center space-x-2">
            {[0, 3, 3.5, 4, 4.5].map((rating) => (
              <button
                key={rating}
                className={`px-2 py-1 text-xs rounded-md ${
                  filters.minRating === rating
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 border border-gray-200'
                } cursor-pointer`}
                onClick={() => handleRatingChange(rating)}
              >
                {rating === 0 ? 'Tous' : rating.toString()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Price filter */}
        <div>
          <label className="text-xs text-gray-600 flex items-center mb-1">
            Prix maximum <FaEuroSign className="text-gray-500 ml-1" />
          </label>
          
          <div className="flex items-center space-x-2">
            {[4, 3, 2, 1].map((price) => (
              <button
                key={price}
                className={`px-2 py-1 text-xs rounded-md ${
                  filters.maxPrice === price
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 border border-gray-200'
                } cursor-pointer`}
                onClick={() => handlePriceChange(price)}
              >
                {Array(price).fill('€').join('')}
              </button>
            ))}
          </div>
        </div>
        
        {/* Open now filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="open-now"
            checked={filters.openNow}
            onChange={handleOpenNowChange}
            className="mr-2 cursor-pointer"
          />
          <label htmlFor="open-now" className="text-xs text-gray-700 cursor-pointer">
            Ouvert maintenant
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;