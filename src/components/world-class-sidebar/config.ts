import { NavEntry } from '@/types/navigation';
import {
  Home,
  ShoppingCart,
  Users,
  Box,
  FileText,
  Settings,
  Truck,
  Package,
  BarChart2,
  Building,
} from 'lucide-react';

export const navigationConfig: NavEntry[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    type: 'item',
    icon: Home,
    to: '/',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    type: 'group',
    icon: Package,
    children: [
      {
        id: 'products',
        label: 'Products',
        type: 'item',
        icon: Box,
        to: '/products',
      },
      {
        id: 'stock',
        label: 'Stock',
        type: 'item',
        icon: BarChart2,
        to: '/stock',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    type: 'group',
    icon: ShoppingCart,
    children: [
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        type: 'item',
        to: '/purchase-orders',
      },
      {
        id: 'sales-orders',
        label: 'Sales Orders',
        type: 'item',
        to: '/sales-orders',
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    type: 'group',
    icon: Users,
    children: [
      { id: 'customers', label: 'Customers', type: 'item', to: '/customers' },
      { id: 'suppliers', label: 'Suppliers', type: 'item', to: '/suppliers' },
      { id: 'users', label: 'Users', type: 'item', to: '/users' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    type: 'item',
    icon: FileText,
    to: '/reports',
    badge: { value: 'New' },
  },
  {
    id: 'settings',
    label: 'Settings',
    type: 'group',
    icon: Settings,
    children: [
      { id: 'locations', label: 'Locations', type: 'item', to: '/settings/locations' },
      { id: 'company', label: 'Company', type: 'item', to: '/settings/company' },
    ],
  },
];
