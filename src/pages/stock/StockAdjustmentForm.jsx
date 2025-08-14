import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStockLevel } from '../../services/stockService';
import { useNotification } from '../../utils/NotificationContext';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const StockAdjustmentForm = ({ onClose, stock }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);

  const mutation = useMutation({
    mutationFn: (newStock) => updateStockLevel(stock.id, newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockLevels'] });
      showNotification('Stock level updated successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error updating stock: ${err.message}`, 'error');
    },
  });

  const handleAdjustStock = (adjustment) => {
    const newStock = stock.quantity + adjustment;
    if (newStock < 0) {
      showNotification('Stock level cannot be negative', 'error');
      return;
    }
    mutation.mutate(newStock);
  };

  return (
    <Box>
      <Typography gutterBottom>
        Adjusting stock for: <strong>{stock.product.name}</strong> at <strong>{stock.location.name}</strong>
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Current stock: {stock.quantity}
      </Typography>
      <TextField
        autoFocus
        margin="dense"
        id="quantity"
        label="Quantity"
        type="number"
        fullWidth
        variant="standard"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        InputProps={{ inputProps: { min: 1 } }}
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => handleAdjustStock(quantity)} variant="contained" color="success" disabled={mutation.isPending}>
          Stock In
        </Button>
        <Button onClick={() => handleAdjustStock(-quantity)} variant="contained" color="warning" disabled={mutation.isPending}>
          Stock Out
        </Button>
      </DialogActions>
      {mutation.isPending && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
    </Box>
  );
};

export default StockAdjustmentForm;
