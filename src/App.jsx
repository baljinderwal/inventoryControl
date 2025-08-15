import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import StockPage from './pages/stock/StockPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import ReportsLayout from './pages/reports/ReportsLayout';
import ProfitabilityPage from './pages/reports/ProfitabilityPage';
import SalesHistoryReport from './pages/reports/SalesHistoryReport';
import InventoryAgingReport from './pages/reports/InventoryAgingReport';
import SupplierPerformanceReport from './pages/reports/SupplierPerformanceReport';
import StockValueReport from './pages/reports/StockValueReport';
import StockExpiryReport from './pages/reports/StockExpiryReport';
import PurchaseOrdersPage from './pages/orders/PurchaseOrdersPage';
import UsersPage from './pages/users/UsersPage';
import LocationsPage from './pages/settings/LocationsPage';
import CustomersPage from './pages/customers/CustomersPage';
import SalesOrdersPage from './pages/sales/SalesOrdersPage';
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
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        </Route>
        <Route element={<PrivateRoute roles={['Admin', 'Manager']} />}>
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales-orders" element={<SalesOrdersPage />} />
          <Route path="/reports" element={<ReportsLayout />}>
            <Route index element={<Navigate to="profitability" replace />} />
            <Route path="profitability" element={<ProfitabilityPage />} />
            <Route path="sales-history" element={<SalesHistoryReport />} />
            <Route path="inventory-aging" element={<InventoryAgingReport />} />
            <Route path="supplier-performance" element={<SupplierPerformanceReport />} />
            <Route path="stock-value" element={<StockValueReport />} />
            <Route path="stock-expiry" element={<StockExpiryReport />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute roles={['Admin', 'Manager']} />}>
          <Route path="/settings/locations" element={<LocationsPage />} />
        </Route>
        <Route element={<PrivateRoute roles={['Admin']} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
