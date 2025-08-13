import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStockLevels } from '../../services/stockService';
import { useNotification } from '../../utils/NotificationContext';

import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import StockAdjustmentForm from './StockAdjustmentForm';
import QrCodeScanner from '../../components/ui/QrCodeScanner';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const LOW_STOCK_THRESHOLD = 50;

const StockPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { showNotification } = useNotification();

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'], // We use the same query key to leverage caching
    queryFn: getStockLevels,
  });

  const handleScanSuccess = (decodedText, decodedResult) => {
    const product = products.find(p => p.qrCode === decodedText);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
      setIsScannerOpen(false);
      showNotification(`Product Found: ${product.name}`, 'success');
    } else {
      showNotification('Product not found', 'error');
    }
  };

  const handleScanFailure = (error) => {
    // console.error(`QR Code scan error = ${error}`);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const tableHeaders = ['Name', 'SKU', 'Stock Quantity', 'Status', 'Actions'];

  const tableData = products?.map(p => ({
    name: p.name,
    sku: p.sku,
    quantity: p.stock,
    status: (
      <Chip
        label={p.stock < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
        color={p.stock < LOW_STOCK_THRESHOLD ? 'error' : 'success'}
        size="small"
      />
    ),
    actions: (
      <Button variant="outlined" size="small" onClick={() => handleOpenModal(p)}>
        Adjust Stock
      </Button>
    )
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching stock levels: {error.message}</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Stock Management</Typography>
        <Button variant="contained" onClick={() => setIsScannerOpen(true)} startIcon={<QrCodeScannerIcon />}>
          Scan to Adjust Stock
        </Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData || []} />

      {selectedProduct && (
        <AppDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Adjust Stock for ${selectedProduct.name}`}
        >
          <StockAdjustmentForm onClose={handleCloseModal} product={selectedProduct} />
        </AppDialog>
      )}

      <AppDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        title="Scan QR Code"
      >
        <QrCodeScanner
          onScanSuccess={handleScanSuccess}
          onScanFailure={handleScanFailure}
          onClose={() => setIsScannerOpen(false)}
        />
      </AppDialog>
    </div>
  );
};

export default StockPage;
