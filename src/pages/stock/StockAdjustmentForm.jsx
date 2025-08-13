import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { getLocations } from '../../services/locationsService';
import { addInventoryBatch, updateInventoryBatch, deleteInventoryBatch } from '../../services/stockService';
import {
  Box,
  Button,
  TextField,
  DialogActions,
  Typography,
  CircularProgress,
  Collapse,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

const StockAdjustmentForm = ({ onClose, product, inventory, totalStock }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [adjustmentType, setAdjustmentType] = useState('in');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [locationId, setLocationId] = useState('');

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const mutation = useMutation({
    mutationFn: async (vars) => {
      if (vars.type === 'in') {
        return addInventoryBatch(vars.payload);
      } else {
        // For 'out', we might need multiple updates.
        // We'll loop and call the update/delete functions.
        for (const op of vars.operations) {
          if (op.type === 'update') {
            await updateInventoryBatch(op.id, { quantity: op.newQuantity });
          } else if (op.type === 'delete') {
            await deleteInventoryBatch(op.id);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryData'] });
      showNotification('Stock level updated successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error updating stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = () => {
    if (adjustmentType === 'in') {
      if (!batchNumber || !expiryDate || !locationId) {
        showNotification('Location, Batch Number, and Expiry Date are required.', 'error');
        return;
      }
      mutation.mutate({
        type: 'in',
        payload: {
          productId: product.id,
          locationId,
          batchNumber,
          quantity,
          expiryDate,
        },
      });
    } else { // Stock Out
      if (!locationId) {
        showNotification('Location is required to remove stock.', 'error');
        return;
      }

      const batchesAtLocation = inventory
        .filter(b => b.productId === product.id && b.locationId === locationId)
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      const stockAtLocation = batchesAtLocation.reduce((sum, b) => sum + b.quantity, 0);

      if (stockAtLocation < quantity) {
        showNotification('Not enough stock at the selected location.', 'error');
        return;
      }

      let remainingQty = quantity;
      const operations = [];

      for (const batch of batchesAtLocation) {
        if (remainingQty <= 0) break;
        const deductQty = Math.min(remainingQty, batch.quantity);
        const newQuantity = batch.quantity - deductQty;

        if (newQuantity > 0) {
          operations.push({ type: 'update', id: batch.id, newQuantity });
        } else {
          operations.push({ type: 'delete', id: batch.id });
        }
        remainingQty -= deductQty;
      }
      mutation.mutate({ type: 'out', operations });
    }
  };

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Typography gutterBottom>Adjusting stock for: <strong>{product.name}</strong></Typography>
      <Typography color="text.secondary" gutterBottom>Current total stock: {totalStock}</Typography>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Adjustment Type</FormLabel>
        <RadioGroup row value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)}>
          <FormControlLabel value="in" control={<Radio />} label="Stock In" />
          <FormControlLabel value="out" control={<Radio />} label="Stock Out" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="location-select-label">Location</InputLabel>
        <Select
          labelId="location-select-label"
          value={locationId}
          label="Location"
          onChange={(e) => setLocationId(e.target.value)}
          required
        >
          {isLoadingLocations ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : (
            locations.map(loc => <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>)
          )}
        </Select>
      </FormControl>

      <TextField
        margin="dense"
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
          label="Batch Number"
          type="text"
          fullWidth
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          required={adjustmentType === 'in'}
        />
        <TextField
          margin="dense"
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
