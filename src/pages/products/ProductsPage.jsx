import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../../services/productService';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';

import MuiTable from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditProductForm from './AddEditProductForm';
import Barcode from '../../components/ui/Barcode';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Stack from '@mui/material/Stack';

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('sku') || '');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [selectedProductForBarcode, setSelectedProductForBarcode] = useState(null);

  useEffect(() => {
    // Sync search query state with URL search param
    const skuFromUrl = searchParams.get('sku');
    if (skuFromUrl) {
      setSearchQuery(skuFromUrl);
    }
  }, [searchParams]);

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
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    // Optional: update URL as user types
    if (newQuery) {
      setSearchParams({ sku: newQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleExport = () => {
    const exportData = filteredProducts.map(p => ({ ...p }));
    const fields = ['id', 'name', 'sku', 'category', 'price', 'costPrice', 'lowStockThreshold', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  };

  const handleOpenBarcodeModal = (product) => {
    setSelectedProductForBarcode(product);
    setIsBarcodeModalOpen(true);
  };

  const handleCloseBarcodeModal = () => {
    setSelectedProductForBarcode(null);
    setIsBarcodeModalOpen(false);
  };

  const tableHeaders = ['Name', 'SKU', 'Category', 'Price', 'Actions'];

  const tableData = filteredProducts.map(p => ({
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: `$${p.price.toFixed(2)}`,
    actions: (
      <Box>
        <IconButton onClick={() => handleOpenBarcodeModal(p)} title="View Barcode"><QrCode2Icon /></IconButton>
        <IconButton onClick={() => handleEditClick(p)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleDeleteClick(p)}><DeleteIcon /></IconButton>
      </Box>
    )
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching products: {error.message}</Alert>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} disabled={!filteredProducts || filteredProducts.length === 0}>
            Export as CSV
          </Button>
          <Button variant="contained" onClick={handleAddClick}>Add Product</Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 2 }}>
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />

      <AppDialog isOpen={isFormOpen} onClose={handleCloseForm} title={productToEdit ? 'Edit Product' : 'Add New Product'}>
        <AddEditProductForm onClose={handleCloseForm} product={productToEdit} />
      </AppDialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${productToDelete?.name}?`}
      />

      {selectedProductForBarcode && (
        <AppDialog isOpen={isBarcodeModalOpen} onClose={handleCloseBarcodeModal} title={`Barcode for ${selectedProductForBarcode.name}`}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Barcode value={selectedProductForBarcode.sku} />
          </Box>
        </AppDialog>
      )}
    </div>
  );
};

export default ProductsPage;
