import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import StockPage from './pages/stock/StockPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import SupplierDetailsPage from './pages/suppliers/SupplierDetailsPage';
import ReportsPage from './pages/reports/ReportsPage'; // Import new page
import PurchaseOrdersPage from './pages/purchase-orders/PurchaseOrdersPage';
import PurchaseOrderForm from './pages/purchase-orders/PurchaseOrderForm';
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
          <Route path="/suppliers" exact element={<SuppliersPage />} />
          <Route path="/suppliers/:id" element={<SupplierDetailsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderForm />} />
          <Route path="/purchase-orders/edit/:id" element={<PurchaseOrderForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
