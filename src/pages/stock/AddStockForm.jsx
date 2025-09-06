import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import AddEditSupplierForm from '../suppliers/AddEditSupplierForm';
import AppDialog from '../../components/ui/AppDialog';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const AddStockForm = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [productId, setProductId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isAddSupplierModalOpen, setAddSupplierModalOpen] = useState(false);

  const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useQuery({
    queryKey: ['products', mode],
    queryFn: () => services.products.getProducts(),
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers, isError: isErrorSuppliers, error: errorSuppliers } = useQuery({
    queryKey: ['suppliers', mode],
    queryFn: () => services.suppliers.getSuppliers(),
  });

  const { data: stockData } = useQuery({
    queryKey: ['stock', productId, mode],
    queryFn: () => services.stock.getProductWithStock(productId),
    enabled: !!productId,
  });

  const handleSizePresetChange = (preset) => {
    let newSizes = [];
    switch (preset) {
      case 'adult':
        newSizes = [
          { size: '6', quantity: 1 },
          { size: '7', quantity: 1 },
          { size: '8', quantity: 1 },
          { size: '9', quantity: 1 },
        ];
        break;
      case 'boy':
        newSizes = [
          { size: '4', quantity: 1 },
          { size: '5', quantity: 1 },
        ];
        break;
      case 'toddler':
        newSizes = [
          { size: '8', quantity: 1 },
          { size: '9', quantity: 1 },
          { size: '10', quantity: 1 },
          { size: '11', quantity: 1 },
          { size: '12', quantity: 1 },
          { size: '1', quantity: 1 },
          { size: '2', quantity: 1 },
          { size: '3', quantity: 1 },
        ];
        break;
      default:
        newSizes = [];
    }
    setSizes(newSizes);
  };

  useEffect(() => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    if (product) {
      if (product.sizeProfile) {
        handleSizePresetChange(product.sizeProfile);
      } else if (product.sizes) {
        setSizes(product.sizes.map(s => ({ ...s, quantity: 1 })));
      } else {
        setSizes([]);
      }
    } else {
      setSizes([]);
    }

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setExpiryDate(nextYear.toISOString().split('T')[0]);

    if (stockData && stockData.batches) {
      const highestBatchNumber = stockData.batches.reduce((max, batch) => {
        const num = parseInt(batch.batchNumber.replace('B-', ''), 10);
        return num > max ? num : max;
      }, 0);
      setBatchNumber(`B-${highestBatchNumber + 1}`);
    } else {
      setBatchNumber('B-1');
    }
  }, [productId, products, stockData]);

  const mutation = useMutation({
    mutationFn: (newStock) => services.stock.addStock(newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      showNotification('Stock added successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error adding stock: ${err.message}`, 'error');
    },
  });

  const handleSizeQuantityChange = (index, quantity) => {
    const newSizes = [...sizes];
    newSizes[index].quantity = parseInt(quantity, 10) || 0;
    setSizes(newSizes);
  };

  const handleSizeChange = (index, size) => {
    const newSizes = [...sizes];
    newSizes[index].size = size;
    setSizes(newSizes);
  };

  const handleDeleteSize = (index) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', quantity: 1 }]);
  };

  const handleSubmit = () => {
    if (!productId || !batchNumber || !expiryDate) {
      showNotification('Please fill in all fields except supplier.', 'error');
      return;
    }
    const totalQuantity = sizes.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    mutation.mutate({
      productId,
      supplierId,
      quantity: totalQuantity,
      sizes,
      batchNumber,
      expiryDate,
      createdDate: new Date().toISOString(),
    });
  };

  const handleSupplierAdded = (newSupplier) => {
    setAddSupplierModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    setSupplierId(newSupplier.id);
  };

  if (isLoadingProducts || isLoadingSuppliers) return <CircularProgress />;
  if (isErrorProducts) return <Alert severity="error">Error fetching products: {errorProducts.message}</Alert>;
  if (isErrorSuppliers) return <Alert severity="error">Error fetching suppliers: {errorSuppliers.message}</Alert>;

  return (
    <Box>
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          label="Product"
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1} alignItems="center">
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="supplier-select-label">Supplier</InputLabel>
          <Select
            labelId="supplier-select-label"
            id="supplier-select"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            label="Supplier"
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={() => setAddSupplierModalOpen(true)}>Add New</Button>
      </Stack>

      {selectedProduct && (
        <Box>
          <Typography variant="h6">Sizes</Typography>
            {sizes.map((size, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Size"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  sx={{ mr: 2, width: '100px' }}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={size.quantity}
                  onChange={(e) => handleSizeQuantityChange(index, e.target.value)}
                  inputProps={{ min: 1 }}
                  sx={{ width: '100px' }}
                />
                <IconButton onClick={() => handleDeleteSize(index)} aria-label="delete size">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddSize} variant="outlined" sx={{ mt: 1 }}>
              Add Size
            </Button>
        </Box>
      )}

      <TextField
        margin="normal"
        id="batchNumber"
        label="Batch Number"
        type="text"
        fullWidth
        variant="outlined"
        value={batchNumber}
        onChange={(e) => setBatchNumber(e.target.value)}
        required
      />
      <TextField
        margin="normal"
        id="expiryDate"
        label="Expiry Date"
        type="date"
        fullWidth
        variant="outlined"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : 'Add Stock'}
        </Button>
      </DialogActions>

      <AppDialog
        open={isAddSupplierModalOpen}
        onClose={() => setAddSupplierModalOpen(false)}
        title="Add New Supplier"
      >
        <AddEditSupplierForm
          onClose={() => setAddSupplierModalOpen(false)}
          onSupplierAdded={handleSupplierAdded}
        />
      </AppDialog>
    </Box>
  );
};

export default AddStockForm;
