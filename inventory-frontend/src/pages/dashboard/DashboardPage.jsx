import React from 'react';
import StatsCard from '../../components/ui/StatsCard';
import { CubeIcon, ShoppingCartIcon, ExclamationCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { name: 'Total Products', stat: '71,897', icon: <CubeIcon className="h-6 w-6" /> },
  { name: 'Total Orders', stat: '2,310', icon: <ShoppingCartIcon className="h-6 w-6" /> },
  { name: 'Low Stock', stat: '12', icon: <ExclamationCircleIcon className="h-6 w-6" /> },
  { name: 'Revenue', stat: '$405,091', icon: <CurrencyDollarIcon className="h-6 w-6" /> },
];

const chartData = [
  { name: 'Jan', Sales: 4000, Stock: 2400 },
  { name: 'Feb', Sales: 3000, Stock: 1398 },
  { name: 'Mar', Sales: 2000, Stock: 9800 },
  { name: 'Apr', Sales: 2780, Stock: 3908 },
  { name: 'May', Sales: 1890, Stock: 4800 },
  { name: 'Jun', Sales: 2390, Stock: 3800 },
];

const DashboardPage = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <StatsCard key={item.name} title={item.name} value={item.stat} icon={item.icon} />
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Inventory Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Stock" fill="#8884d8" />
            <Bar dataKey="Sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
