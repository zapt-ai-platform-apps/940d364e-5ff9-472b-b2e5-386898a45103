import React from 'react';
import { FaUtensils } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaUtensils className="text-blue-600 text-2xl mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Resto Globe</h1>
        </div>
        <div className="text-sm text-gray-500">
          Trouvez des restaurants dans le monde entier
        </div>
      </div>
    </header>
  );
};

export default Header;