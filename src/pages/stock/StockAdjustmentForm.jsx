import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../../services/productService'; // Changed from stockService
import { useNotification } from '../../utils/NotificationContext';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const StockAdjustmentForm = ({ onClose, product }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [adjustmentType, setAdjustmentType] = useState('in'); // 'in' or 'out'
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Calculate total stock from batches
  const totalStock = product.batches.reduce((acc, batch) => acc + batch.quantity, 0);

  const mutation = useMutation({
    // Use the more generic updateProduct mutation
    mutationFn: (updatedProduct) => updateProduct(product.id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showNotification('Stock level updated successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error updating stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = () => {
    if (adjustmentType === 'in') {
      if (!batchNumber || !expiryDate) {
        showNotification('Batch Number and Expiry Date are required for Stock In.', 'error');
        return;
      }
      const newBatches = [...product.batches];
      const existingBatchIndex = newBatches.findIndex(b => b.batchNumber === batchNumber);

      if (existingBatchIndex > -1) {
        // Update existing batch
        newBatches[existingBatchIndex].quantity += quantity;
      } else {
        // Add new batch
        newBatches.push({ batchNumber, quantity, expiryDate });
      }

      const updatedProduct = { ...product, batches: newBatches };
      mutation.mutate(updatedProduct);

    } else { // Stock Out
      let remainingQty = quantity;
      const newBatches = JSON.parse(JSON.stringify(product.batches)); // Deep copy

      if (totalStock < remainingQty) {
        showNotification('Not enough stock available.', 'error');
        return;
      }

      // Simple FEFO: deduct from earliest expiring batches first
      newBatches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      for (const batch of newBatches) {
        if (remainingQty <= 0) break;
        const deductQty = Math.min(remainingQty, batch.quantity);
        batch.quantity -= deductQty;
        remainingQty -= deductQty;
      }

      const updatedBatches = newBatches.filter(b => b.quantity > 0);
      const updatedProduct = { ...product, batches: updatedBatches };
      mutation.mutate(updatedProduct);
    }
  };

  const handleAdjustmentTypeChange = (event) => {
    setAdjustmentType(event.target.value);
  };

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Typography gutterBottom>
        Adjusting stock for: <strong>{product.name}</strong>
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Current total stock: {totalStock}
      </Typography>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Adjustment Type</FormLabel>
        <RadioGroup row name="adjustmentType" value={adjustmentType} onChange={handleAdjustmentTypeChange}>
          <FormControlLabel value="in" control={<Radio />} label="Stock In" />
          <FormControlLabel value="out" control={<Radio />} label="Stock Out" />
        </RadioGroup>
      </FormControl>

      <TextField
        autoFocus
        margin="dense"
        id="quantity"
        label="Quantity"
        type="number"
        fullWidth
        required
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
        InputProps={{ inputProps: { min: 1 } }}
      />

      <Collapse in={adjustmentType === 'in'}>
        <TextField
          margin="dense"
          id="batchNumber"
          label="Batch Number"
          type="text"
          fullWidth
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          required={adjustmentType === 'in'}
        />
        <TextField
          margin="dense"
          id="expiryDate"
          label="Expiry Date"
          type="date"
          fullWidth
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required={adjustmentType === 'in'}
        />
      </Collapse>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : 'Confirm Adjustment'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default StockAdjustmentForm;
