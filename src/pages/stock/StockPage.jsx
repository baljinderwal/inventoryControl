import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import StockAdjustmentForm from './StockAdjustmentForm';
import AppDialog from '../../components/ui/AppDialog';
import MuiTable from '../../components/ui/Table';
import BarcodeScanner from '../../components/ui/BarcodeScanner';
import { useNotification } from '../../utils/NotificationContext';

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { QrCodeScanner } from '@mui/icons-material';

const StockPage = () => {
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { mode, services } = useApi();
  const { showNotification } = useNotification();

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

  const handleOpenDetailsModal = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedProduct(null);
    setIsDetailsModalOpen(false);
  };

  const handleScan = (scannedBarcode) => {
    setIsScannerOpen(false);
    const product = stockLevels?.find(p => p.barcode === scannedBarcode);
    if (product) {
      handleOpenAdjustmentModal(product);
    } else {
      showNotification(`Product with barcode ${scannedBarcode} not found.`, 'error');
    }
  };

  const tableHeaders = [
    { id: 'name', label: 'Name' },
    { id: 'sku', label: 'SKU' },
    { id: 'quantity', label: 'Total Stock' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = stockLevels?.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    quantity: p.stock,
    status: (
      <Chip
        label={p.stock < p.lowStockThreshold ? 'Low Stock' : 'In Stock'}
        color={p.stock < p.lowStockThreshold ? 'error' : 'success'}
        size="small"
        sx={{ 
          fontWeight: 600,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&.MuiChip-colorError': {
            backgroundColor: 'error.main',
            color: 'error.contrastText'
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'success.main', 
            color: 'success.contrastText'
          }
        }}
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
          onClick={() => handleOpenDetailsModal(p)}
        >
          View Details
        </Button>
      </Stack>
    )
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching stock levels: {error.message}</Alert>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Stock Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<QrCodeScanner />}
          onClick={() => setIsScannerOpen(true)}
        >
          Scan to Adjust
        </Button>
      </Box>
      <MuiTable headers={tableHeaders} data={tableData || []} />

      <Dialog open={isScannerOpen} onClose={() => setIsScannerOpen(false)}>
        <DialogTitle>Scan Barcode to Adjust Stock</DialogTitle>
        <DialogContent>
          {isScannerOpen && <BarcodeScanner onScan={handleScan} />}
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <AppDialog
          open={isAdjustmentModalOpen}
          onClose={handleCloseAdjustmentModal}
          title={`Adjust Stock for ${selectedProduct.name}`}
        >
          <StockAdjustmentForm onClose={handleCloseAdjustmentModal} product={selectedProduct} />
        </AppDialog>
      )}

      {selectedProduct && (
        <AppDialog
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          title={`Stock Details for ${selectedProduct.name}`}
          maxWidth="md"
        >
          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Batch Number</TableCell>
                  <TableCell>Expiry Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProduct.batches?.map(batch => (
                    <TableRow key={batch.batchNumber}>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>{batch.batchNumber}</TableCell>
                      <TableCell>{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </DialogContent>
        </AppDialog>
      )}
    </div>
  );
};

export default StockPage;
