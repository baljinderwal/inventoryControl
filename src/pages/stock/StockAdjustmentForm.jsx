import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';

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

const StockAdjustmentForm = ({
  onClose,
  product
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [adjustmentType, setAdjustmentType] = useState('in'); // 'in' or 'out'
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const mutation = useMutation({
    mutationFn: services.stock.adjustStockLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      showNotification('Stock level updated successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error updating stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = () => {
    const adjQuantity = adjustmentType === 'in' ? quantity : -quantity;
    if (adjustmentType === 'in' && (!batchNumber || !expiryDate)) {
      showNotification('Batch number and expiry date are required for Stock In.', 'error');
      return;
    }
    mutation.mutate({
      productId: product.id,
      quantity: adjQuantity,
      batchNumber: adjustmentType === 'in' ? batchNumber : undefined,
      expiryDate: adjustmentType === 'in' ? expiryDate : undefined,
    });
  };

  return (
    <Box>
      <Typography gutterBottom>
        Adjusting stock for: <strong>{product.name}</strong>
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Current total stock: {product.stock}
      </Typography>

      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="adjustment-type-label">Adjustment Type</InputLabel>
        <Select
          labelId="adjustment-type-label"
          id="adjustment-type"
          value={adjustmentType}
          onChange={(e) => setAdjustmentType(e.target.value)}
          label="Adjustment Type"
        >
          <MenuItem value="in">Stock In</MenuItem>
          <MenuItem value="out">Stock Out</MenuItem>
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

      {adjustmentType === 'in' && (
        <>
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
        </>
      )}

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : 'Submit Adjustment'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default StockAdjustmentForm;
