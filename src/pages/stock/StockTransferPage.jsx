import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getStockLevels, transferStock } from '../../services/stockService';
import { getLocations } from '../../services/locationService';
import { useNotification } from '../../utils/NotificationContext';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';

const StockTransferPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { data: stockLevels = [], isLoading: isLoadingStock } = useQuery({
    queryKey: ['stockLevels'],
    queryFn: getStockLevels,
  });

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const products = useMemo(() => {
    const productMap = new Map();
    stockLevels.forEach(stock => {
      productMap.set(stock.product.id, stock.product);
    });
    return Array.from(productMap.values());
  }, [stockLevels]);

  const mutation = useMutation({
    mutationFn: (transferData) => transferStock(transferData.productId, transferData.fromLocationId, transferData.toLocationId, transferData.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['stockLevels']);
      showNotification('Stock transferred successfully', 'success');
      navigate('/stock');
    },
    onError: (err) => {
      showNotification(`Error transferring stock: ${err.message}`, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !fromLocation || !toLocation || quantity <= 0) {
      showNotification('Please fill all fields correctly.', 'warning');
      return;
    }
    if (fromLocation.id === toLocation.id) {
      showNotification('Source and destination locations cannot be the same.', 'warning');
      return;
    }

    const sourceStock = stockLevels.find(s => s.productId === selectedProduct.id && s.locationId === fromLocation.id);
    if (!sourceStock || sourceStock.quantity < quantity) {
      showNotification('Insufficient stock at the source location.', 'error');
      return;
    }

    mutation.mutate({
      productId: selectedProduct.id,
      fromLocationId: fromLocation.id,
      toLocationId: toLocation.id,
      quantity,
    });
  };

  const isLoading = isLoadingStock || isLoadingLocations;

  if (isLoading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Transfer
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) => setSelectedProduct(value)}
              renderInput={(params) => <TextField {...params} label="Product" required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={locations}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) => setFromLocation(value)}
              renderInput={(params) => <TextField {...params} label="From Location" required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={locations}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) => setToLocation(value)}
              renderInput={(params) => <TextField {...params} label="To Location" required />}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              fullWidth
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => navigate('/stock')}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={mutation.isPending}>
                {mutation.isPending ? <CircularProgress size={24} /> : 'Transfer Stock'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StockTransferPage;
