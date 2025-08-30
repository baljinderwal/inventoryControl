import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
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
import GuidedVoiceAdd from '../../components/ui/GuidedVoiceAdd';
import { generateBarcode } from '../../utils/barcodeGenerator';

const AddEditProductForm = ({
  onClose,
  product
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [voiceState, setVoiceState] = useState('idle');
  const [inputMode, setInputMode] = useState('voicePerField');
  const [startGuidedVoice, setStartGuidedVoice] = useState(false);

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
    sizes: '',
    color: '',
  });

  const isEditMode = Boolean(product);

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

  const handleGenerateBarcode = () => {
    const newBarcode = generateBarcode();
    setFormData((prev) => ({ ...prev, barcode: newBarcode }));
  };

  useEffect(() => {
    if (!isEditMode) {
      handleGenerateBarcode();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (inputMode === 'guidedVoice' && !isEditMode) {
      setStartGuidedVoice(true);
    } else {
      setStartGuidedVoice(false);
    }
  }, [inputMode, isEditMode]);

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
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
    };
    if (isEditMode) {
      delete submissionData.stock;
      delete submissionData.batchNumber;
      delete submissionData.expiryDate;
    }
    mutation.mutate(submissionData);
  };

  const guidedVoiceFields = [
    { name: 'name', label: 'Product Name' },
    { name: 'sku', label: 'SKU' },
    { name: 'category', label: 'Category' },
    { name: 'price', label: 'Price' },
    { name: 'costPrice', label: 'Cost Price' },
    { name: 'lowStockThreshold', label: 'Low Stock Threshold' },
    { name: 'stock', label: 'Initial Stock' },
    { name: 'batchNumber', label: 'Batch Number' },
    { name: 'expiryDate', label: 'Expiry Date' },
    { name: 'color', label: 'Color' },
    { name: 'sizes', label: 'Sizes' },
  ];

  const handleGuidedVoiceUpdate = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal" variant="outlined">
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
          <MenuItem value="guidedVoice">Guided Voice</MenuItem>
        </Select>
      </FormControl>
      {inputMode === 'smartVoice' && <SmartVoiceAdd onResult={handleSmartVoiceResult} />}
      {inputMode === 'guidedVoice' && !isEditMode && (
        <GuidedVoiceAdd
          fields={guidedVoiceFields}
          onUpdate={handleGuidedVoiceUpdate}
          onComplete={() => setStartGuidedVoice(false)}
          start={startGuidedVoice}
        />
      )}
      
      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Basic Information
      </Typography>
      
      <TextField
        margin="normal"
        id="name"
        name="name"
        label="Product Name"
        inputProps={{ 'data-testid': 'name-input' }}
        type="text"
        fullWidth
        variant="outlined"
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
        margin="normal"
        id="sku"
        name="sku"
        label="SKU"
        inputProps={{ 'data-testid': 'sku-input' }}
        type="text"
        fullWidth
        variant="outlined"
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
        margin="normal"
        id="barcode"
        name="barcode"
        label="Barcode"
        inputProps={{ 'data-testid': 'barcode-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.barcode}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {inputMode === 'voicePerField' && (
                <VoiceRecognition
                  onResult={(transcript) => setFormData((prev) => ({ ...prev, barcode: transcript }))}
                  onStateChange={setVoiceState}
                />
              )}
              <Button onClick={handleGenerateBarcode}>Generate</Button>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        id="category"
        name="category"
        label="Category"
        inputProps={{ 'data-testid': 'category-input' }}
        type="text"
        fullWidth
        variant="outlined"
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
      
      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Pricing & Inventory
      </Typography>
      
      <TextField
        margin="normal"
        id="price"
        name="price"
        label="Price"
        type="number"
        fullWidth
        variant="outlined"
        value={formData.price}
        onChange={handleChange}
        required
        inputProps={{ 'data-testid': 'price-input' }}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, price: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        id="costPrice"
        name="costPrice"
        label="Cost Price"
        type="number"
        fullWidth
        variant="outlined"
        value={formData.costPrice}
        onChange={handleChange}
        required
        inputProps={{ 'data-testid': 'costPrice-input' }}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, costPrice: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        id="lowStockThreshold"
        name="lowStockThreshold"
        label="Low Stock Threshold"
        type="number"
        fullWidth
        variant="outlined"
        value={formData.lowStockThreshold}
        onChange={handleChange}
        required
        inputProps={{ 'data-testid': 'lowStockThreshold-input' }}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) =>
                  setFormData((prev) => ({ ...prev, lowStockThreshold: transcript }))
                }
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      
      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Additional Details
      </Typography>
      
      <TextField
        margin="normal"
        id="imageUrl"
        name="imageUrl"
        label="Image URL"
        inputProps={{ 'data-testid': 'imageUrl-input' }}
        type="text"
        fullWidth
        variant="outlined"
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
      <TextField
        margin="normal"
        id="color"
        name="color"
        label="Color"
        inputProps={{ 'data-testid': 'color-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.color}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, color: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        id="sizes"
        name="sizes"
        label="Sizes (comma-separated)"
        inputProps={{ 'data-testid': 'sizes-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.sizes}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, sizes: transcript }))}
                onStateChange={setVoiceState}
              />
            </InputAdornment>
          ),
        }}
      />

      {!isEditMode && (
        <>
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Stock Information
          </Typography>
          
          <TextField
            margin="normal"
            id="stock"
            name="stock"
            label="Initial Stock"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.stock}
            onChange={handleChange}
            inputProps={{ 'data-testid': 'stock-input' }}
            InputProps={{
              endAdornment: inputMode === 'voicePerField' && (
                <InputAdornment position="end">
                  <VoiceRecognition
                    onResult={(transcript) => setFormData((prev) => ({ ...prev, stock: transcript }))}
                    onStateChange={setVoiceState}
                  />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            id="batchNumber"
            name="batchNumber"
            label="Batch Number"
            inputProps={{ 'data-testid': 'batchNumber-input' }}
            type="text"
            fullWidth
            variant="outlined"
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
          <TextField
            margin="normal"
            id="expiryDate"
            name="expiryDate"
            label="Expiry Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.expiryDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: inputMode === 'voicePerField' && (
                <InputAdornment position="end">
                  <VoiceRecognition
                    onResult={(transcript) =>
                      setFormData((prev) => ({ ...prev, expiryDate: transcript }))
                    }
                    onStateChange={setVoiceState}
                  />
                </InputAdornment>
              ),
            }}
          />
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
