import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, CubeIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Stock', href: '/stock', icon: ArchiveBoxIcon },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex items-center justify-center h-16 bg-gray-900 text-white">
          <span className="text-xl font-bold">Inv-Ctrl</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-800">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
