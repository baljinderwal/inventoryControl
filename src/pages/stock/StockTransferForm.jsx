import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { updateInventoryBatch, deleteInventoryBatch, addInventoryBatch } from '../../services/stockService';
import {
  Box, Button, TextField, DialogActions, Typography, CircularProgress,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

const StockTransferForm = ({ onClose, product, fromLocation, locations, inventory }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [toLocationId, setToLocationId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const availableBatches = inventory.filter(b => b.productId === product.id && b.locationId === fromLocation.id);
  const selectedBatch = availableBatches.find(b => b.id === batchId);

  const mutation = useMutation({
    mutationFn: async ({ fromBatch, toLocationId, quantityToTransfer }) => {
      const sourceNewQuantity = fromBatch.quantity - quantityToTransfer;

      // 1. Decrement from source location
      if (sourceNewQuantity > 0) {
        await updateInventoryBatch(fromBatch.id, { quantity: sourceNewQuantity });
      } else {
        await deleteInventoryBatch(fromBatch.id);
      }

      // 2. Increment at destination location
      const destInventory = inventory.find(b =>
        b.productId === product.id &&
        b.locationId === toLocationId &&
        b.batchNumber === fromBatch.batchNumber
      );

      if (destInventory) {
        // Update existing batch at destination
        await updateInventoryBatch(destInventory.id, { quantity: destInventory.quantity + quantityToTransfer });
      } else {
        // Create new batch at destination
        const { id, ...newBatchData } = fromBatch; // eslint-disable-line no-unused-vars
        await addInventoryBatch({
          ...newBatchData,
          locationId: toLocationId,
          quantity: quantityToTransfer,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryData'] });
      showNotification('Stock transferred successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error transferring stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatch || !toLocationId || quantity <= 0) {
      showNotification('Please fill all fields correctly.', 'error');
      return;
    }
    if (quantity > selectedBatch.quantity) {
      showNotification('Transfer quantity cannot exceed batch quantity.', 'error');
      return;
    }
    mutation.mutate({ fromBatch: selectedBatch, toLocationId, quantityToTransfer: quantity });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography gutterBottom>Transferring: <strong>{product.name}</strong></Typography>
      <Typography color="text.secondary" gutterBottom>From: {fromLocation.name}</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="batch-select-label">Batch to Transfer</InputLabel>
        <Select
          labelId="batch-select-label"
          value={batchId}
          label="Batch to Transfer"
          onChange={(e) => {
            setBatchId(e.target.value);
            const newSelectedBatch = availableBatches.find(b => b.id === e.target.value);
            if (newSelectedBatch) {
              setQuantity(1); // Reset quantity when batch changes
            }
          }}
          required
        >
          {availableBatches.map(b => (
            <MenuItem key={b.id} value={b.id}>
              {`Batch #${b.batchNumber} (Qty: ${b.quantity}, Exp: ${new Date(b.expiryDate).toLocaleDateString()})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="to-location-select-label">To Location</InputLabel>
        <Select
          labelId="to-location-select-label"
          value={toLocationId}
          label="To Location"
          onChange={(e) => setToLocationId(e.target.value)}
          required
        >
          {locations
            .filter(loc => loc.id !== fromLocation.id)
            .map(loc => <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>)}
        </Select>
      </FormControl>

      <TextField
        margin="dense"
        label="Quantity to Transfer"
        type="number"
        fullWidth
        required
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
        InputProps={{ inputProps: { min: 1, max: selectedBatch?.quantity || 1 } }}
        disabled={!selectedBatch}
      />

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending || !selectedBatch}>
          {mutation.isPending ? <CircularProgress size={24} /> : 'Confirm Transfer'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default StockTransferForm;
