import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import StockPage from './pages/stock/StockPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import ReportsPage from './pages/reports/ReportsPage';
import OrdersPage from './pages/orders/OrdersPage'; // Import OrdersPage
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/orders" element={<OrdersPage />} /> {/* Add Orders Route */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
