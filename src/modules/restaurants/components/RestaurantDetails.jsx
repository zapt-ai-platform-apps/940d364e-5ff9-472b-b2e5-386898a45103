import React, { useEffect, useState } from 'react';
import { FaStar, FaGlobe, FaPhone, FaTimes, FaEuroSign } from 'react-icons/fa';
import { getRestaurantDetails } from '../api/placesApi';
import * as Sentry from '@sentry/browser';

const RestaurantDetails = ({ restaurant, onClose }) => {
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const details = await getRestaurantDetails(restaurant.place_id);
        setDetailedInfo(details);
      } catch (error) {
        console.error('Error loading restaurant details:', error);
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [restaurant.place_id]);

  const renderPriceLevel = (level) => {
    if (!level && level !== 0) return 'Non spécifié';
    
    const euros = [];
    for (let i = 0; i < level; i++) {
      euros.push(<FaEuroSign key={i} className="text-gray-600" />);
    }
    
    return <div className="flex">{euros}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{restaurant.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="p-6">
            {detailedInfo?.photos?.[0]?.photo_reference && (
              <div className="mb-4">
                <img 
                  src={`${detailedInfo.photos[0].getUrl?.() || `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${detailedInfo.photos[0].photo_reference}&key=${import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}`}`}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Adresse</h3>
              <p className="text-gray-600">{detailedInfo?.formatted_address || restaurant.vicinity}</p>
            </div>

            {detailedInfo?.formatted_phone_number && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Téléphone</h3>
                <a 
                  href={`tel:${detailedInfo.formatted_phone_number}`}
                  className="text-blue-600 flex items-center"
                >
                  <FaPhone className="mr-2" />
                  {detailedInfo.formatted_phone_number}
                </a>
              </div>
            )}

            {detailedInfo?.website && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Site Web</h3>
                <a 
                  href={detailedInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center"
                >
                  <FaGlobe className="mr-2" />
                  Visiter le site
                </a>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Note</h3>
              <div className="flex items-center">
                {detailedInfo?.rating ? (
                  <>
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{detailedInfo.rating.toFixed(1)}</span>
                    {detailedInfo?.user_ratings_total && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({detailedInfo.user_ratings_total} avis)
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">Aucun avis</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Niveau de prix</h3>
              {renderPriceLevel(detailedInfo?.price_level)}
            </div>

            {detailedInfo?.opening_hours?.weekday_text && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Horaires d'ouverture</h3>
                <ul className="text-gray-600 space-y-1">
                  {detailedInfo.opening_hours.weekday_text.map((day, index) => (
                    <li key={index}>{day}</li>
                  ))}
                </ul>
              </div>
            )}

            {detailedInfo?.reviews && detailedInfo.reviews.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Avis récents</h3>
                <div className="space-y-3">
                  {detailedInfo.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="border-t pt-3">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{review.author_name}</div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mb-1">
                        {new Date(review.time * 1000).toLocaleDateString()}
                      </div>
                      <p className="text-gray-600 text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;