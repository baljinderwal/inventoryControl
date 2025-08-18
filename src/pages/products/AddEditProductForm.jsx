import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import { locationService } from '../../services/locationService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Add, Delete } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

const AddEditProductForm = ({
  onClose,
  product
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();
  const a_services = { ...services, locations: locationService[mode] };


  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    price: '',
    costPrice: '',
    lowStockThreshold: '',
    imageUrl: '',
    stock: '',
    batchNumber: '',
    expiryDate: '',
    locationId: '',
    type: 'simple',
    bundleItems: [],
  });
  const [selectedBundleItem, setSelectedBundleItem] = useState(null);
  const [bundleItemQuantity, setBundleItemQuantity] = useState(1);

  const isEditMode = Boolean(product);

  const { data: locations = [] } = useQuery({
    queryKey: ['locations', mode],
    queryFn: () => a_services.locations.getLocations(),
    enabled: !isEditMode,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', mode],
    queryFn: () => services.products.getProducts(),
    enabled: formData.type === 'bundle',
  });

  const simpleProducts = products.filter(p => p.type === 'simple');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        lowStockThreshold: product.lowStockThreshold || '',
        imageUrl: product.imageUrl || '',
        stock: '',
        batchNumber: '',
        expiryDate: '',
        locationId: '',
        type: product.type || 'simple',
        bundleItems: product.bundleItems || [],
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: isEditMode ?
      (updatedProduct) => services.products.updateProduct(product.id, updatedProduct) :
      services.products.addProduct,
    onSuccess: (data) => {
      showNotification(`Product ${isEditMode ? 'updated' : 'added'} successfully`, 'success');

      if (mode === 'local' && !isEditMode) {
        // Manually update the products list in the cache
        queryClient.setQueryData(['stock', 'local'], (oldStock) => {
          const newProductStock = {
            ...data,
            stock: data.stock || 0, // from form
            // Ensure other fields expected by the table are present
            stockByLocation: data.locationId ? [{
                locationId: data.locationId,
                locationName: locations.find(l => l.id === data.locationId)?.name || 'N/A',
                quantity: data.stock || 0,
                batches: [{
                  batchNumber: data.batchNumber || `temp-batch-${data.id}`,
                  expiryDate: data.expiryDate || 'N/A',
                  quantity: data.stock || 0,
                }]
            }] : [],
          };
          return [...(oldStock || []), newProductStock];
        });
      } else {
        // In API mode or for edits, invalidate queries to refetch from the source
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['stock'] });
      }
      onClose();
    },
    onError: (err) => {
      showNotification(`Error: ${err.message}`, 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      type: value,
      bundleItems: value === 'simple' ? [] : prev.bundleItems,
    }));
  };

  const handleAddBundleItem = () => {
    if (!selectedBundleItem || bundleItemQuantity <= 0) {
      showNotification('Please select a product and enter a valid quantity.', 'warning');
      return;
    }
    const existingItem = formData.bundleItems.find(item => item.productId === selectedBundleItem.id);
    if (existingItem) {
      showNotification('Product already in bundle. You can edit the quantity.', 'info');
      return;
    }
    setFormData(prev => ({
      ...prev,
      bundleItems: [...prev.bundleItems, { productId: selectedBundleItem.id, quantity: bundleItemQuantity }]
    }));
    setSelectedBundleItem(null);
    setBundleItemQuantity(1);
  };

  const handleRemoveBundleItem = (productId) => {
    setFormData(prev => ({
      ...prev,
      bundleItems: prev.bundleItems.filter(item => item.productId !== productId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 0,
    };

    if (formData.type === 'simple') {
      submissionData.stock = parseInt(formData.stock, 10) || 0;
      delete submissionData.bundleItems;
    } else {
      delete submissionData.stock;
      delete submissionData.batchNumber;
      delete submissionData.expiryDate;
      delete submissionData.locationId;
    }

    if (isEditMode) {
      delete submissionData.stock;
      delete submissionData.batchNumber;
      delete submissionData.expiryDate;
      delete submissionData.locationId;
    }

    mutation.mutate(submissionData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="dense" id="name" name="name" label="Product Name" type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required />
      <TextField margin="dense" id="sku" name="sku" label="SKU" type="text" fullWidth variant="standard" value={formData.sku} onChange={handleChange} required />
      <TextField margin="dense" id="barcode" name="barcode" label="Barcode" type="text" fullWidth variant="standard" value={formData.barcode} onChange={handleChange} />
      <TextField margin="dense"id="category" name="category" label="Category" type="text" fullWidth variant="standard" value={formData.category} onChange={handleChange} required />
      <TextField margin="dense" id="price" name="price" label="Price" type="number" fullWidth variant="standard" value={formData.price} onChange={handleChange} required />
      <TextField margin="dense" id="costPrice" name="costPrice" label="Cost Price" type="number" fullWidth variant="standard" value={formData.costPrice} onChange={handleChange} required />
      <TextField margin="dense" id="lowStockThreshold" name="lowStockThreshold" label="Low Stock Threshold" type="number" fullWidth variant="standard" value={formData.lowStockThreshold} onChange={handleChange} required />
      <TextField margin="dense" id="imageUrl" name="imageUrl" label="Image URL" type="text" fullWidth variant="standard" value={formData.imageUrl} onChange={handleChange} />

      <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel id="product-type-label">Product Type</InputLabel>
        <Select
          labelId="product-type-label"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleProductTypeChange}
          label="Product Type"
        >
          <MenuItem value="simple">Simple</MenuItem>
          <MenuItem value="bundle">Bundle</MenuItem>
        </Select>
      </FormControl>

      {formData.type === 'bundle' && (
        <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Bundle Items</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Autocomplete
                options={simpleProducts}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedBundleItem}
                onChange={(event, newValue) => setSelectedBundleItem(newValue)}
                renderInput={(params) => <TextField {...params} label="Select Product" variant="standard" />}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                type="number"
                variant="standard"
                value={bundleItemQuantity}
                onChange={(e) => setBundleItemQuantity(Number(e.target.value))}
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={handleAddBundleItem} color="primary">
                <Add />
              </IconButton>
            </Grid>
          </Grid>
          <List dense>
            {formData.bundleItems.map(item => {
                const itemProduct = products.find(p => p.id === item.productId);
                return (
                    <ListItem
                        key={item.productId}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveBundleItem(item.productId)}>
                                <Delete />
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={itemProduct ? itemProduct.name : `Product ID: ${item.productId}`}
                            secondary={`Quantity: ${item.quantity}`}
                        />
                    </ListItem>
                );
            })}
          </List>
        </Box>
      )}

      {!isEditMode && formData.type === 'simple' && (
        <>
          <TextField margin="dense" id="stock" name="stock" label="Initial Stock" type="number" fullWidth variant="standard" value={formData.stock} onChange={handleChange} />
          <FormControl fullWidth margin="dense" variant="standard" disabled={!formData.stock || formData.stock <= 0}>
            <InputLabel id="location-select-label">Location for Initial Stock</InputLabel>
            <Select
              labelId="location-select-label"
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              label="Location for Initial Stock"
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField margin="dense" id="batchNumber" name="batchNumber" label="Batch Number" type="text" fullWidth variant="standard" value={formData.batchNumber} onChange={handleChange} />
          <TextField margin="dense" id="expiryDate" name="expiryDate" label="Expiry Date" type="date" fullWidth variant="standard" value={formData.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        </>
      )}

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : (isEditMode ? 'Update Product' : 'Add Product')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddEditProductForm;
