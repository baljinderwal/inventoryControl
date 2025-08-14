import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import { locationService } from '../../services/locationService';

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
  const a_services = { ...services, locations: locationService[mode] };

  const [locationId, setLocationId] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('in'); // 'in' or 'out'
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', mode],
    queryFn: () => a_services.locations.getLocations(),
  });

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
    if (!locationId) {
      showNotification('Please select a location.', 'error');
      return;
    }
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
      locationId: locationId,
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

      <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel id="location-select-label">Location</InputLabel>
        <Select
          labelId="location-select-label"
          id="locationId"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          label="Location"
          disabled={isLoadingLocations}
        >
          {locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense" variant="standard">
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
        margin="dense"
        id="quantity"
        label="Quantity"
        type="number"
        fullWidth
        variant="standard"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
        InputProps={{ inputProps: { min: 1 } }}
      />

      {adjustmentType === 'in' && (
        <>
          <TextField
            margin="dense"
            id="batchNumber"
            label="Batch Number"
            type="text"
            fullWidth
            variant="standard"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="expiryDate"
            label="Expiry Date"
            type="date"
            fullWidth
            variant="standard"
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
