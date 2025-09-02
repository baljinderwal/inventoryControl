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

  useEffect(() => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    if (product && product.sizes) {
      setSizes(product.sizes.map(s => ({ ...s, quantity: 1 })));
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

  const handleSizeQuantityChange = (size, quantity) => {
    const newSizes = sizes.map((s) =>
      s.size === size ? { ...s, quantity: Math.max(0, parseInt(quantity, 10)) } : s
    );
    setSizes(newSizes);
  };

  const handleSubmit = () => {
    if (!productId || !batchNumber || !expiryDate) {
      showNotification('Please fill in all fields except supplier.', 'error');
      return;
    }
    const totalQuantity = sizes.reduce((acc, curr) => acc + curr.quantity, 0);
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

      {selectedProduct && selectedProduct.sizes && (
        <Box>
          <Typography variant="h6">Sizes</Typography>
          {sizes.map((size, index) => (
            <TextField
              key={index}
              margin="normal"
              label={`Size ${size.size}`}
              type="number"
              fullWidth
              variant="outlined"
              value={size.quantity}
              onChange={(e) => handleSizeQuantityChange(size.size, e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
            />
          ))}
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
