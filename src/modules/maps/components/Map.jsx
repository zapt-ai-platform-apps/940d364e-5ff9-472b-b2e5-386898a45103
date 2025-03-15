import React, { useCallback, useEffect, useState } from 'react';
import { useRestaurantContext } from '../../restaurants/context/RestaurantContext';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import * as Sentry from '@sentry/browser';
import ZoomControls from './ZoomControls';
import { FaLocationArrow } from 'react-icons/fa';

const defaultLocation = { lat: 48.8566, lng: 2.3522 }; // Paris

const Map = () => {
  const { restaurants, selectedRestaurant, setSelectedRestaurant, searchLocation } = useRestaurantContext();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(14);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          console.log('User location detected:', pos);
        },
        (error) => {
          console.error('Error getting user location:', error);
          Sentry.captureException(error);
        }
      );
    } else {
      console.log('Geolocation not supported by browser');
    }
  }, []);

  useEffect(() => {
    if (searchLocation && map) {
      map.panTo(searchLocation);
      setZoom(14);
    }
  }, [searchLocation, map]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    if (map) {
      map.panTo({ lat: restaurant.geometry.location.lat, lng: restaurant.geometry.location.lng });
    }
  };

  const centerOnUserLocation = () => {
    if (currentPosition && map) {
      map.panTo(currentPosition);
      setZoom(15);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      const newZoom = Math.min(map.getZoom() + 1, 20);
      setZoom(newZoom);
      map.setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const newZoom = Math.max(map.getZoom() - 1, 3);
      setZoom(newZoom);
      map.setZoom(newZoom);
    }
  };

  if (!isLoaded) return <div className="flex items-center justify-center h-full">Chargement de la carte...</div>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerClassName="map-container"
        center={searchLocation || currentPosition || defaultLocation}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
        }}
      >
        {restaurants.map((restaurant) => (
          <MarkerF
            key={restaurant.place_id}
            position={{
              lat: restaurant.geometry.location.lat,
              lng: restaurant.geometry.location.lng
            }}
            onClick={() => handleMarkerClick(restaurant)}
            animation={selectedRestaurant?.place_id === restaurant.place_id ? 1 : null} // 1 = BOUNCE
            icon={selectedRestaurant?.place_id === restaurant.place_id ? {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(45, 45)
            } : {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(38, 38)
            }}
          />
        ))}

        {currentPosition && (
          <MarkerF
            position={currentPosition}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            title="Votre position"
          />
        )}
      </GoogleMap>

      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

      {currentPosition && (
        <button
          onClick={centerOnUserLocation}
          className="absolute bottom-28 right-4 bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
          title="Centrer sur ma position"
        >
          <FaLocationArrow />
        </button>
      )}
    </div>
  );
};

export default Map;