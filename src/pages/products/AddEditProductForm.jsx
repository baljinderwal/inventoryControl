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
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import VoiceRecognition from '../../components/ui/VoiceRecognition';
import SmartVoiceAdd from '../../components/ui/SmartVoiceAdd';

const AddEditProductForm = ({
  onClose,
  product
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();
  const a_services = { ...services, locations: locationService[mode] };

  const [voiceState, setVoiceState] = useState('idle');
  const [inputMode, setInputMode] = useState('manual');

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
  });

  const isEditMode = Boolean(product);

  const { data: locations = [] } = useQuery({
    queryKey: ['locations', mode],
    queryFn: () => a_services.locations.getLocations(),
    enabled: !isEditMode, // Only fetch locations in add mode
  });

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
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: isEditMode ?
      (updatedProduct) => services.products.updateProduct(product.id, updatedProduct) :
      services.products.addProduct,
    onSuccess: () => {
      showNotification(`Product ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
      // Invalidate the specific query key used by the ProductsPage to ensure it refetches.
      queryClient.invalidateQueries({ queryKey: ['stock', mode] });
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

  const handleSmartVoiceResult = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 0,
      stock: parseInt(formData.stock, 10) || 0,
    };
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
      <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel id="input-mode-select-label">Input Mode</InputLabel>
        <Select
          labelId="input-mode-select-label"
          id="inputMode"
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value)}
          label="Input Mode"
        >
          <MenuItem value="manual">Manual Entry</MenuItem>
          <MenuItem value="voicePerField">Voice per Field</MenuItem>
          <MenuItem value="smartVoice">Smart Voice Add</MenuItem>
        </Select>
      </FormControl>
      {inputMode === 'smartVoice' && <SmartVoiceAdd onResult={handleSmartVoiceResult} />}
      <TextField
        margin="dense"
        id="name"
        name="name"
        label="Product Name"
        type="text"
        fullWidth
        variant="standard"
        value={formData.name}
        onChange={handleChange}
        required
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, name: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      {voiceState === 'listening' && (
        <Typography variant="caption" color="secondary">
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="dense"
        id="sku"
        name="sku"
        label="SKU"
        type="text"
        fullWidth
        variant="standard"
        value={formData.sku}
        onChange={handleChange}
        required
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, sku: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="dense"
        id="barcode"
        name="barcode"
        label="Barcode"
        type="text"
        fullWidth
        variant="standard"
        value={formData.barcode}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, barcode: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="dense"
        id="category"
        name="category"
        label="Category"
        type="text"
        fullWidth
        variant="standard"
        value={formData.category}
        onChange={handleChange}
        required
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, category: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField margin="dense" id="price" name="price" label="Price" type="number" fullWidth variant="standard" value={formData.price} onChange={handleChange} required />
      <TextField margin="dense" id="costPrice" name="costPrice" label="Cost Price" type="number" fullWidth variant="standard" value={formData.costPrice} onChange={handleChange} required />
      <TextField margin="dense" id="lowStockThreshold" name="lowStockThreshold" label="Low Stock Threshold" type="number" fullWidth variant="standard" value={formData.lowStockThreshold} onChange={handleChange} required />
      <TextField
        margin="dense"
        id="imageUrl"
        name="imageUrl"
        label="Image URL"
        type="text"
        fullWidth
        variant="standard"
        value={formData.imageUrl}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, imageUrl: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />

      {!isEditMode && (
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
          <TextField
            margin="dense"
            id="batchNumber"
            name="batchNumber"
            label="Batch Number"
            type="text"
            fullWidth
            variant="standard"
            value={formData.batchNumber}
            onChange={handleChange}
            InputProps={{
              endAdornment: inputMode === 'voicePerField' && (
                <InputAdornment position="end">
                  <VoiceRecognition
                    onResult={(transcript) => setFormData((prev) => ({ ...prev, batchNumber: transcript }))}
                    onStateChange={setVoiceState}
                  />
                </InputAdornment>
              ),
            }}
          />
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
