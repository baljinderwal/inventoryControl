import React from 'react';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex items-center">
      <div className="p-3 bg-indigo-500 text-white rounded-full mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
