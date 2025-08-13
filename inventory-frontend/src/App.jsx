import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import StockPage from './pages/stock/StockPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import ReportsPage from './pages/reports/ReportsPage';
import OrdersPage from './pages/orders/OrdersPage';
import UsersPage from './pages/users/UsersPage';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route element={<PrivateRoute roles={['Admin', 'Manager', 'Staff']} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
        <Route element={<PrivateRoute roles={['Admin', 'Manager']} />}>
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
        <Route element={<PrivateRoute roles={['Admin']} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
