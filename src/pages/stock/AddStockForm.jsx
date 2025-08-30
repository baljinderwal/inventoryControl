import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';

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

const AddStockForm = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const { data: products = [], isLoading: isLoadingProducts, isError, error } = useQuery({
    queryKey: ['products', mode],
    queryFn: () => services.products.getProducts(),
  });

  const mutation = useMutation({
    mutationFn: services.stock.addStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      showNotification('Stock added successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error adding stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = () => {
    if (!productId || !batchNumber || !expiryDate) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }
    mutation.mutate({
      productId: parseInt(productId, 10),
      quantity,
      batchNumber,
      expiryDate,
    });
  };

  if (isLoadingProducts) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching products: {error.message}</Alert>;

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

      <TextField
        autoFocus
        margin="normal"
        id="quantity"
        label="Quantity"
        type="number"
        fullWidth
        variant="outlined"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
        InputProps={{ inputProps: { min: 1 } }}
      />

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
    </Box>
  );
};

export default AddStockForm;
