import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
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

  const [adjustmentType, setAdjustmentType] = useState('out');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState(batches.length > 0 ? batches[0].batchNumber : '');
  const [supplierId, setSupplierId] = useState('');
  const [sizeQuantities, setSizeQuantities] = useState({});

  const selectedBatch = useMemo(() => {
    return batches.find(b => b.batchNumber === batchNumber);
  }, [batchNumber, batches]);

  const hasSizes = useMemo(() => {
    return selectedBatch && selectedBatch.sizes && selectedBatch.sizes.length > 0;
  }, [selectedBatch]);

  useEffect(() => {
    if (batchNumber) {
      const newSelectedBatch = batches.find(b => b.batchNumber === batchNumber);
      if (newSelectedBatch) {
        setSupplierId(newSelectedBatch.supplierId || '');
        if (newSelectedBatch.sizes && newSelectedBatch.sizes.length > 0) {
          const initialQuantities = newSelectedBatch.sizes.reduce((acc, s) => {
            acc[s.size] = 0;
            return acc;
          }, {});
          setSizeQuantities(initialQuantities);
        } else {
          setSizeQuantities({});
        }
      }
    }
  }, [batchNumber, batches]);

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers', mode],
    queryFn: () => services.suppliers.getSuppliers(),
  });

  const adjustStockMutation = useMutation({
    mutationFn: services.stock.adjustStockLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', mode] });
      queryClient.invalidateQueries({ queryKey: ['product', product.id, mode] });
      showNotification('Stock level updated successfully', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error updating stock: ${err.message}`, 'error');
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: services.stock.updateBatchSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', mode] });
      showNotification('Supplier updated successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error updating supplier: ${err.message}`, 'error');
    },
  });

  const handleSizeQuantityChange = (size, value) => {
    const newQuantity = Math.max(0, parseInt(value, 10) || 0);
    if (adjustmentType === 'out') {
      const currentSize = selectedBatch.sizes.find(s => s.size === size);
      if (newQuantity > currentSize.quantity) {
        showNotification(`Cannot remove more than available stock for size ${size} (${currentSize.quantity})`, 'error');
        return;
      }
    }
    const newQuantities = { ...sizeQuantities, [size]: newQuantity };
    setSizeQuantities(newQuantities);
  };

  const handleSubmit = () => {
    if (!batchNumber) {
      showNotification('Please select a batch to adjust.', 'error');
      return;
    }

    if (hasSizes) {
        for (const size in sizeQuantities) {
            if (adjustmentType === 'out') {
                const currentSize = selectedBatch.sizes.find(s => s.size === size);
                if (sizeQuantities[size] > currentSize.quantity) {
                    showNotification(`Quantity for size ${size} exceeds available stock.`, 'error');
                    return;
                }
            }
        }

      const sizesToAdjust = Object.entries(sizeQuantities)
        .map(([size, q]) => ({ size, quantity: adjustmentType === 'in' ? q : -q }))
        .filter(s => s.quantity !== 0);

      if (sizesToAdjust.length === 0) {
        showNotification('Please enter a quantity for at least one size.', 'error');
        return;
      }
      adjustStockMutation.mutate({
        productId: product.id,
        batchNumber,
        sizes: sizesToAdjust,
      });
    } else {
      if (adjustmentType === 'out' && quantity > selectedBatch.quantity) {
        showNotification('Cannot remove more than the available batch quantity.', 'error');
        return;
      }
      const adjQuantity = adjustmentType === 'in' ? quantity : -quantity;
      if (quantity <= 0) {
        showNotification('Please enter a quantity greater than 0.', 'error');
        return;
      }
      adjustStockMutation.mutate({
        productId: product.id,
        quantity: adjQuantity,
        batchNumber,
      });
    }
  };

  const handleSupplierUpdate = () => {
    if (!batchNumber || !supplierId) {
      showNotification('Please select a batch and a supplier.', 'error');
      return;
    }
    updateSupplierMutation.mutate({
      productId: product.id,
      batchNumber,
      supplierId,
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FormControl fullWidth margin="normal" variant="outlined" sx={{ my: 0 }}>
          <InputLabel id="supplier-select-label">Supplier</InputLabel>
          <Select
            labelId="supplier-select-label"
            id="supplier-select"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            label="Supplier"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleSupplierUpdate}
          disabled={updateSupplierMutation.isPending || !supplierId || supplierId === selectedBatch?.supplierId}
          variant="outlined"
        >
          Update Supplier
        </Button>
      </Box>

      {hasSizes ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Adjust Quantities by Size</Typography>
          <Grid container spacing={2}>
            {selectedBatch.sizes.map((s) => (
              <Grid item xs={6} sm={4} key={s.size}>
                <TextField
                  margin="dense"
                  id={`size-${s.size}`}
                  label={`${s.size} (Current: ${s.quantity})`}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={sizeQuantities[s.size] || 0}
                  onChange={(e) => handleSizeQuantityChange(s.size, e.target.value)}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <TextField
          autoFocus
          margin="normal"
          id="quantity"
          label="Quantity to Adjust"
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          InputProps={{ inputProps: { min: 1 } }}
        />
      )}

      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={adjustStockMutation.isPending}>
          {adjustStockMutation.isPending ? <CircularProgress size={24} /> : 'Submit Adjustment'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default StockAdjustmentForm;
