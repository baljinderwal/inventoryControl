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
  product,
  batches
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [adjustmentType, setAdjustmentType] = useState('out'); // 'in' or 'out'
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState(batches.length > 0 ? batches[0].batchNumber : '');

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
    if (!batchNumber) {
      showNotification('Please select a batch to adjust.', 'error');
      return;
    }
    mutation.mutate({
      productId: product.id,
      quantity: adjQuantity,
      batchNumber,
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
          <MenuItem value="out">Stock Out (Remove)</MenuItem>
          <MenuItem value="in">Stock In (Add)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="batch-select-label">Batch</InputLabel>
        <Select
          labelId="batch-select-label"
          id="batch-select"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          label="Batch"
        >
          {batches.map((batch) => (
            <MenuItem key={batch.batchNumber} value={batch.batchNumber}>
              {`Batch: ${batch.batchNumber} (Current Qty: ${batch.quantity})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        autoFocus
        margin="normal"
        id="quantity"
        label="Quantity to Adjust"
        type="number"
        fullWidth
        variant="outlined"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
        InputProps={{ inputProps: { min: 1 } }}
      />

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
