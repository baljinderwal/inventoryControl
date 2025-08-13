import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Table from '../../components/ui/Table';

const LowStockPage = () => {
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  const headers = ['SKU', 'Product Name', 'Category', 'Current Stock', 'Threshold'];
  const data = lowStockProducts.map(p => ({
    sku: p.sku,
    name: p.name,
    category: p.category,
    stock: p.stock,
    threshold: p.lowStockThreshold,
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching product data: {error.message}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Low Stock Alerts
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        This report lists all products where the current stock level is at or below the configured threshold.
      </Typography>

      {lowStockProducts.length > 0 ? (
        <Table headers={headers} data={data} />
      ) : (
        <Alert severity="info">No products are currently low on stock.</Alert>
      )}
    </Paper>
  );
};

export default LowStockPage;
