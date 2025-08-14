import React, { useState, useEffect } from 'react';
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

const StockTransferForm = ({ product, onClose }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();
  const a_services = { ...services, locations: locationService[mode] };

  const [fromLocationId, setFromLocationId] = useState('');
  const [toLocationId, setToLocationId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', mode],
    queryFn: () => a_services.locations.getLocations(),
  });

  const mutation = useMutation({
    mutationFn: services.stock.transferStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      showNotification('Stock transferred successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error transferring stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = () => {
    if (!fromLocationId || !toLocationId || !quantity) {
      showNotification('Please fill all fields.', 'error');
      return;
    }
    if (fromLocationId === toLocationId) {
      showNotification('From and To locations cannot be the same.', 'error');
      return;
    }

    const fromLocationStock = product.stockByLocation.find(s => s.locationId === fromLocationId);
    if (quantity > fromLocationStock.quantity) {
      showNotification('Transfer quantity cannot be more than available stock.', 'error');
      return;
    }

    mutation.mutate({
      productId: product.id,
      fromLocationId,
      toLocationId,
      quantity,
    });
  };

  const availableFromLocations = product.stockByLocation || [];

  return (
    <Box>
      <Typography gutterBottom>
        Transferring stock for: <strong>{product.name}</strong>
      </Typography>

      <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel id="from-location-select-label">From Location</InputLabel>
        <Select
          labelId="from-location-select-label"
          id="fromLocationId"
          value={fromLocationId}
          onChange={(e) => setFromLocationId(e.target.value)}
          label="From Location"
          disabled={isLoadingLocations}
        >
          {availableFromLocations.map((stockEntry) => (
            <MenuItem key={stockEntry.locationId} value={stockEntry.locationId}>
              {stockEntry.locationName} (Available: {stockEntry.quantity})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel id="to-location-select-label">To Location</InputLabel>
        <Select
          labelId="to-location-select-label"
          id="toLocationId"
          value={toLocationId}
          onChange={(e) => setToLocationId(e.target.value)}
          label="To Location"
          disabled={isLoadingLocations}
        >
          {locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
            </MenuItem>
          ))}
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

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : 'Submit Transfer'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default StockTransferForm;
