import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import StockAdjustmentForm from './StockAdjustmentForm';
import AppDialog from '../../components/ui/AppDialog';
import MuiTable from '../../components/ui/Table';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const StockPage = () => {
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { mode, services } = useApi();

  const { data: stockLevels = [], isLoading, isError, error } = useQuery({
    queryKey: ['stock', mode],
    queryFn: services.stock.getStockLevels,
  });

  const handleOpenAdjustmentModal = (product) => {
    setSelectedProduct(product);
    setIsAdjustmentModalOpen(true);
  };

  const handleCloseAdjustmentModal = () => {
    setSelectedProduct(null);
    setIsAdjustmentModalOpen(false);
  };

  const handleOpenBatchModal = (product) => {
    setSelectedProduct(product);
    setIsBatchModalOpen(true);
  };

  const handleCloseBatchModal = () => {
    setSelectedProduct(null);
    setIsBatchModalOpen(false);
  };

  const tableHeaders = ['Name', 'SKU', 'Total Stock', 'Status', 'Actions'];

  const tableData = stockLevels?.map(p => ({
    name: p.name,
    sku: p.sku,
    quantity: p.stock,
    status: (
      <Chip
        label={p.stock < p.lowStockThreshold ? 'Low Stock' : 'In Stock'}
        color={p.stock < p.lowStockThreshold ? 'error' : 'success'}
        size="small"
      />
    ),
    actions: (
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" size="small" onClick={() => handleOpenAdjustmentModal(p)}>
          Adjust Stock
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => handleOpenBatchModal(p)}
          disabled={!p.batches || p.batches.length === 0}
        >
          View Batches
        </Button>
      </Stack>
    )
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching stock levels: {error.message}</Alert>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Stock Management
      </Typography>
      <MuiTable headers={tableHeaders} data={tableData || []} />

      {selectedProduct && (
        <AppDialog
          isOpen={isAdjustmentModalOpen}
          onClose={handleCloseAdjustmentModal}
          title={`Adjust Stock for ${selectedProduct.name}`}
        >
          <StockAdjustmentForm onClose={handleCloseAdjustmentModal} product={selectedProduct} />
        </AppDialog>
      )}

      {selectedProduct && (
        <AppDialog
          isOpen={isBatchModalOpen}
          onClose={handleCloseBatchModal}
          title={`Batches for ${selectedProduct.name}`}
        >
          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Batch Number</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Expiry Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProduct.batches?.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)).map((batch) => (
                  <TableRow key={batch.batchNumber}>
                    <TableCell>{batch.batchNumber}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </AppDialog>
      )}
    </div>
  );
};

export default StockPage;
