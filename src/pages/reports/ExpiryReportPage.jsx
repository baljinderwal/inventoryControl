import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import MuiTable from '../../components/ui/Table';
import { Paper, Typography, CircularProgress, Alert } from '@mui/material';

const ExpiryReportPage = () => {
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const allBatches = products
    .flatMap(p => p.batches.map(b => ({
      ...b,
      productName: p.name,
      sku: p.sku,
      productId: p.id,
    })))
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const tableHeaders = ['Product Name', 'SKU', 'Batch Number', 'Expiry Date', 'Quantity'];

  const tableData = allBatches.map(batch => ({
    productName: batch.productName,
    sku: batch.sku,
    batchNumber: batch.batchNumber,
    expiryDate: new Date(batch.expiryDate).toLocaleDateString(),
    quantity: batch.quantity,
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching report data: {error.message}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Expiry Report
      </Typography>
      <Typography variant="body2" gutterBottom>
        List of all product batches, sorted by the soonest expiration date.
      </Typography>
      <MuiTable headers={tableHeaders} data={tableData} />
    </Paper>
  );
};

export default ExpiryReportPage;
