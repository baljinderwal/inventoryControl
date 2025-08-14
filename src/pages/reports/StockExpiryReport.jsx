import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStockLevels } from '../../services/stockService';
import MuiTable from '../../components/ui/Table';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';

const StockExpiryReport = () => {
  const { data: stockLevels = [], isLoading, isError, error } = useQuery({
    queryKey: ['stock'],
    queryFn: getStockLevels,
  });

  const reportData = stockLevels
    .flatMap(product =>
      (product.batches || []).map(batch => ({
        ...batch,
        productName: product.name,
        productSku: product.sku,
        expiryDate: new Date(batch.expiryDate),
      }))
    )
    .sort((a, b) => a.expiryDate - b.expiryDate);

  const tableHeaders = ['Product Name', 'SKU', 'Batch Number', 'Quantity', 'Expiry Date'];

  const tableData = reportData.map(item => ({
    productName: item.productName,
    productSku: item.productSku,
    batchNumber: item.batchNumber,
    quantity: item.quantity,
    expiryDate: item.expiryDate.toLocaleDateString(),
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching stock levels: {error.message}</Alert>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Stock by Expiry Date Report
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This report shows all stock batches, sorted by the soonest expiry date.
      </Typography>
      <MuiTable headers={tableHeaders} data={tableData} />
    </Paper>
  );
};

export default StockExpiryReport;
