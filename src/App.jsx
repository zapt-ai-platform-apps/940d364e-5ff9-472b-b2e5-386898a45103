import React from 'react';
import Map from './modules/maps/components/Map';
import SearchContainer from './modules/restaurants/components/SearchContainer';
import RestaurantList from './modules/restaurants/components/RestaurantList';
import ZaptBadge from './modules/ui/components/ZaptBadge';
import { RestaurantProvider } from './modules/restaurants/context/RestaurantContext';
import Header from './modules/ui/components/Header';

export default function App() {
  return (
    <RestaurantProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-white">
            <SearchContainer />
            <RestaurantList />
          </div>
          <div className="w-full md:w-2/3 h-1/2 md:h-full relative">
            <Map />
          </div>
        </div>
        <ZaptBadge />
      </div>
    </RestaurantProvider>
  );
}