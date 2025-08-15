import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './utils/SidebarContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import FullScreenLoader from './components/ui/FullScreenLoader';

// Lazy load all the page components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'));
const StockPage = lazy(() => import('./pages/stock/StockPage'));
const SuppliersPage = lazy(() => import('./pages/suppliers/SuppliersPage'));
const ReportsLayout = lazy(() => import('./pages/reports/ReportsLayout'));
const ProfitabilityPage = lazy(() => import('./pages/reports/ProfitabilityPage'));
const SalesHistoryReport = lazy(() => import('./pages/reports/SalesHistoryReport'));
const InventoryAgingReport = lazy(() => import('./pages/reports/InventoryAgingReport'));
const SupplierPerformanceReport = lazy(() => import('./pages/reports/SupplierPerformanceReport'));
const StockValueReport = lazy(() => import('./pages/reports/StockValueReport'));
const StockExpiryReport = lazy(() => import('./pages/reports/StockExpiryReport'));
const PurchaseOrdersPage = lazy(() => import('./pages/orders/PurchaseOrdersPage'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));
const LocationsPage = lazy(() => import('./pages/settings/LocationsPage'));
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'));
const SalesOrdersPage = lazy(() => import('./pages/sales/SalesOrdersPage'));


function App() {
  return (
    <SidebarProvider>
      <Suspense fallback={<FullScreenLoader />}>
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
      </Suspense>
    </SidebarProvider>
  );
}

export default App;
