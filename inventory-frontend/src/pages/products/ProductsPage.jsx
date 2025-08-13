import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../../services/productService';
import { useNotification } from '../../utils/NotificationContext';

import MuiTable from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditProductForm from './AddEditProductForm';
import QrCodeScanner from '../../components/ui/QrCodeScanner';
import QrCodeDisplay from '../../components/ui/QrCodeDisplay';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrCodeToDisplay, setQrCodeToDisplay] = useState(null);

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showNotification('Product deleted successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting product: ${err.message}`, 'error');
    },
  });

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.qrCode && product.qrCode.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  const handleScanSuccess = (decodedText, decodedResult) => {
    setSearchQuery(decodedText);
    setIsScannerOpen(false);
    showNotification(`Scanned QR Code: ${decodedText}`, 'success');
  };

  const handleScanFailure = (error) => {
    // console.error(`QR Code scan error = ${error}`);
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  }

  const tableHeaders = ['Name', 'SKU', 'Category', 'Price', 'Stock', 'QR Code', 'Actions'];

  const tableData = filteredProducts.map(p => ({
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: `$${p.price.toFixed(2)}`,
    stock: p.stock,
    qrCode: p.qrCode,
    actions: (
      <Box>
        <IconButton onClick={() => setQrCodeToDisplay(p.qrCode)}><VisibilityIcon /></IconButton>
        <IconButton onClick={() => handleEditClick(p)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleDeleteClick(p)}><DeleteIcon /></IconButton>
      </Box>
    )
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching products: {error.message}</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Box>
          <Button variant="contained" onClick={() => setIsScannerOpen(true)} startIcon={<QrCodeScannerIcon />}>
            Scan Product
          </Button>
          <Button variant="contained" onClick={handleAddClick} sx={{ ml: 2 }}>
            Add Product
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />

      <AppDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={productToEdit ? 'Edit Product' : 'Add New Product'}
      >
        <AddEditProductForm onClose={handleCloseForm} product={productToEdit} />
      </AppDialog>

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

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${productToDelete?.name}?`}
      />

      <AppDialog
        isOpen={Boolean(qrCodeToDisplay)}
        onClose={() => setQrCodeToDisplay(null)}
        title="Product QR Code"
      >
        <QrCodeDisplay value={qrCodeToDisplay} />
      </AppDialog>
    </div>
  );
};

export default ProductsPage;
