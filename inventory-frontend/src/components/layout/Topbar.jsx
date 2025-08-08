import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Topbar = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {/* Mobile menu button - functionality can be added later */}
          <button className="md:hidden mr-4 text-gray-500 hover:text-gray-600">
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Inventory Control</h1>
        </div>
        <div className="flex items-center">
          {/* Placeholder for user menu */}
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
