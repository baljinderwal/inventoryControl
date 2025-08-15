import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import { SidebarProvider } from './utils/SidebarContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/auth/SignupPage'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const ProductsPage = React.lazy(() => import('./pages/products/ProductsPage'));
const StockPage = React.lazy(() => import('./pages/stock/StockPage'));
const SuppliersPage = React.lazy(() => import('./pages/suppliers/SuppliersPage'));
const ReportsLayout = React.lazy(() => import('./pages/reports/ReportsLayout'));
const ProfitabilityPage = React.lazy(() => import('./pages/reports/ProfitabilityPage'));
const SalesHistoryReport = React.lazy(() => import('./pages/reports/SalesHistoryReport'));
const InventoryAgingReport = React.lazy(() => import('./pages/reports/InventoryAgingReport'));
const SupplierPerformanceReport = React.lazy(() => import('./pages/reports/SupplierPerformanceReport'));
const StockValueReport = React.lazy(() => import('./pages/reports/StockValueReport'));
const StockExpiryReport = React.lazy(() => import('./pages/reports/StockExpiryReport'));
const PurchaseOrdersPage = React.lazy(() => import('./pages/orders/PurchaseOrdersPage'));
const UsersPage = React.lazy(() => import('./pages/users/UsersPage'));
const LocationsPage = React.lazy(() => import('./pages/settings/LocationsPage'));
const CustomersPage = React.lazy(() => import('./pages/customers/CustomersPage'));
const SalesOrdersPage = React.lazy(() => import('./pages/sales/SalesOrdersPage'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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
      </Suspense>
    </SidebarProvider>
  );
}

export default App;
