import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
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
import { generateSku } from '../../utils/skuGenerator';

const AVAILABLE_COLORS = ["Black", "White", "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Gray", "Silver", "Gold", "Wood"];

const getFutureDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

const AddEditProductForm = ({
  onClose,
  product
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [listeningField, setListeningField] = useState(null);
  const [inputMode, setInputMode] = useState('voicePerField');
  const [startGuidedVoice, setStartGuidedVoice] = useState(false);
  const [priceMultiplier, setPriceMultiplier] = useState(1.5);
  const [discountPercentage, setDiscountPercentage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    sku: generateSku(),
    barcode: '',
    category: '',
    brand: '',
    model: '',
    gender: 'Male',
    weight: '',
    countryOfOrigin: 'India',
    description: '',
    price: '',
    costPrice: '',
    discountedPrice: '',
    lowStockThreshold: '',
    imageUrl: '',
    stock: '',
    batchNumber: 'B-1001',
    expiryDate: getFutureDate(),
    createdDate: new Date().toISOString().split('T')[0],
    sizes: [
      { size: '6', quantity: 1 },
      { size: '7', quantity: 1 },
      { size: '8', quantity: 1 },
      { size: '9', quantity: 1 },
    ],
    colors: [],
  });

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category || '',
        brand: product.brand || '',
        model: product.model || '',
        gender: product.gender || '',
        weight: product.weight || '',
        countryOfOrigin: product.countryOfOrigin || '',
        description: product.description || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        discountedPrice: product.discountedPrice || '',
        lowStockThreshold: product.lowStockThreshold || '',
        imageUrl: product.imageUrl || '',
        stock: '',
        batchNumber: '',
        expiryDate: '',
        createdDate: product.createdDate || '',
        colors: product.colors || [],
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [
          { size: '6', quantity: 1 },
          { size: '7', quantity: 1 },
          { size: '8', quantity: 1 },
          { size: '9', quantity: 1 },
        ],
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

  const handleColorSelect = (color) => {
    const newColors = formData.colors.includes(color)
      ? formData.colors.filter((c) => c !== color)
      : [...formData.colors, color];
    setFormData((prev) => ({ ...prev, colors: newColors }));
  };

  const handleSizeQuantityChange = (index, quantity) => {
    const newSizes = [...formData.sizes];
    newSizes[index].quantity = parseInt(quantity, 10) || 0;
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleSizePresetChange = (preset) => {
    let newSizes = [];
    switch (preset) {
      case 'adult':
        newSizes = [
          { size: '6', quantity: 1 },
          { size: '7', quantity: 1 },
          { size: '8', quantity: 1 },
          { size: '9', quantity: 1 },
        ];
        break;
      case 'boy':
        newSizes = [
          { size: '4', quantity: 1 },
          { size: '5', quantity: 1 },
        ];
        break;
      case 'toddler':
        newSizes = [
          { size: '8', quantity: 1 },
          { size: '9', quantity: 1 },
          { size: '10', quantity: 1 },
          { size: '11', quantity: 1 },
          { size: '12', quantity: 1 },
          { size: '1', quantity: 1 },
          { size: '2', quantity: 1 },
          { size: '3', quantity: 1 },
        ];
        break;
      default:
        newSizes = formData.sizes;
    }
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleGenerateBarcode = () => {
    const newBarcode = generateBarcode();
    setFormData((prev) => ({ ...prev, barcode: newBarcode }));
  };

  const handleGenerateSku = () => {
    const newSku = generateSku();
    setFormData((prev) => ({ ...prev, sku: newSku }));
  };

  useEffect(() => {
    const cost = parseFloat(formData.costPrice);
    if (!isNaN(cost)) {
      const newPrice = cost * priceMultiplier;
      setFormData((prev) => ({ ...prev, price: newPrice.toFixed(2) }));
    }
  }, [formData.costPrice, priceMultiplier]);

  useEffect(() => {
    const price = parseFloat(formData.price);
    if (!isNaN(price)) {
      const discount = price * (discountPercentage / 100);
      const newDiscountedPrice = price - discount;
      setFormData((prev) => ({ ...prev, discountedPrice: newDiscountedPrice.toFixed(2) }));
    }
  }, [formData.price, discountPercentage]);

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

    const totalStock = formData.sizes.reduce((acc, item) => acc + item.quantity, 0);

    const submissionData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      discountedPrice: parseFloat(formData.discountedPrice) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 0,
      stock: totalStock,
    };
    if (isEditMode) {
      delete submissionData.stock;
      delete submissionData.batchNumber;
      delete submissionData.expiryDate;
      delete submissionData.createdDate;
    }
    mutation.mutate(submissionData);
  };

  const guidedVoiceFields = [
    { name: 'name', label: 'Product Name' },
    { name: 'sku', label: 'SKU' },
    { name: 'category', label: 'Category' },
    { name: 'brand', label: 'Brand' },
    { name: 'model', label: 'Model' },
    { name: 'gender', label: 'Gender' },
    { name: 'weight', label: 'Weight' },
    { name: 'countryOfOrigin', label: 'Country of Origin' },
    { name: 'description', label: 'Description' },
    { name: 'price', label: 'Price' },
    { name: 'costPrice', label: 'Cost Price' },
    { name: 'lowStockThreshold', label: 'Low Stock Threshold' },
    { name: 'batchNumber', label: 'Batch Number' },
    { name: 'expiryDate', label: 'Expiry Date' },
    { name: 'colors', label: 'Colors' },
  ];

  const handleGuidedVoiceUpdate = (fieldName, value) => {
    if (fieldName === 'colors') {
      const lowerCaseValue = value.toLowerCase();
      // Improved parsing to handle various separators and extra spaces
      const colorsArray = lowerCaseValue
        .replace(/add |remove /g, '')
        .split(/,|\s+/)
        .map(c => c.trim())
        .filter(c => c)
        .map(c => c.charAt(0).toUpperCase() + c.slice(1)); // Capitalize first letter

      if (lowerCaseValue.startsWith('add')) {
        const newColors = [...new Set([...formData.colors, ...colorsArray])];
        setFormData(prev => ({ ...prev, colors: newColors.filter(c => AVAILABLE_COLORS.includes(c)) }));
      } else if (lowerCaseValue.startsWith('remove')) {
        setFormData(prev => ({ ...prev, colors: formData.colors.filter(c => !colorsArray.includes(c))}));
      } else {
        // Default behavior: add the colors
        const newColors = [...new Set([...formData.colors, ...colorsArray])];
        setFormData(prev => ({ ...prev, colors: newColors.filter(c => AVAILABLE_COLORS.includes(c)) }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
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
                onStateChange={(state) => setListeningField(state === 'listening' ? 'name' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'name' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="normal"
        id="brand"
        name="brand"
        label="Brand"
        inputProps={{ 'data-testid': 'brand-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.brand}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, brand: transcript }))}
                onStateChange={(state) => setListeningField(state === 'listening' ? 'brand' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'brand' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="normal"
        id="model"
        name="model"
        label="Model"
        inputProps={{ 'data-testid': 'model-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.model}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, model: transcript }))}
                onStateChange={(state) => setListeningField(state === 'listening' ? 'model' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'model' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="normal"
        id="gender"
        name="gender"
        label="Gender"
        inputProps={{ 'data-testid': 'gender-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.gender}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, gender: transcript }))}
                onStateChange={(state) => setListeningField(state === 'listening' ? 'gender' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'gender' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="normal"
        id="weight"
        name="weight"
        label="Weight"
        inputProps={{ 'data-testid': 'weight-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.weight}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, weight: transcript }))}
                onStateChange={(state) => setListeningField(state === 'listening' ? 'weight' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'weight' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="normal"
        id="countryOfOrigin"
        name="countryOfOrigin"
        label="Country of Origin"
        inputProps={{ 'data-testid': 'countryOfOrigin-input' }}
        type="text"
        fullWidth
        variant="outlined"
        value={formData.countryOfOrigin}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, countryOfOrigin: transcript }))}
                onStateChange={(state) => setListeningField(state === 'listening' ? 'countryOfOrigin' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'countryOfOrigin' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <TextField
        margin="normal"
        id="description"
        name="description"
        label="Description"
        inputProps={{ 'data-testid': 'description-input' }}
        type="text"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={formData.description}
        onChange={handleChange}
        InputProps={{
          endAdornment: inputMode === 'voicePerField' && (
            <InputAdornment position="end">
              <VoiceRecognition
                onResult={(transcript) => setFormData((prev) => ({ ...prev, description: transcript }))}
                onStateChange={(state) => setListeningField(state === 'listening' ? 'description' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'description' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
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
          endAdornment: (
            <InputAdornment position="end">
              {inputMode === 'voicePerField' && (
                <VoiceRecognition
                  onResult={(transcript) => setFormData((prev) => ({ ...prev, sku: transcript }))}
                  onStateChange={(state) => setListeningField(state === 'listening' ? 'sku' : null)}
                />
              )}
              <Button onClick={handleGenerateSku}>Generate</Button>
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'sku' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
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
                  onStateChange={(state) => setListeningField(state === 'listening' ? 'barcode' : null)}
                />
              )}
              <Button onClick={handleGenerateBarcode}>Generate</Button>
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'barcode' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
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
                onStateChange={(state) => setListeningField(state === 'listening' ? 'category' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'category' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      
      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Pricing & Inventory
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  onStateChange={(state) => setListeningField(state === 'listening' ? 'costPrice' : null)}
                />
              </InputAdornment>
            ),
          }}
        />
        {listeningField === 'costPrice' && (
          <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
            Listening... Speak now.
          </Typography>
        )}
        <TextField
          margin="normal"
          label="Price Multiplier"
          type="number"
          value={priceMultiplier}
          onChange={(e) => setPriceMultiplier(parseFloat(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">x</InputAdornment>,
          }}
          sx={{width: '250px'}}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  onStateChange={(state) => setListeningField(state === 'listening' ? 'price' : null)}
                />
              </InputAdornment>
            ),
          }}
        />
        {listeningField === 'price' && (
          <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
            Listening... Speak now.
          </Typography>
        )}
        <TextField
          margin="normal"
          label="Discount"
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          sx={{width: '250px'}}
        />
      </Box>
      <TextField
        margin="normal"
        id="discountedPrice"
        name="discountedPrice"
        label="Discounted Price"
        type="number"
        fullWidth
        variant="outlined"
        value={formData.discountedPrice}
        onChange={handleChange}
        inputProps={{ 'data-testid': 'discountedPrice-input' }}
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
                onStateChange={(state) => setListeningField(state === 'listening' ? 'lowStockThreshold' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'lowStockThreshold' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      
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
                onStateChange={(state) => setListeningField(state === 'listening' ? 'imageUrl' : null)}
              />
            </InputAdornment>
          ),
        }}
      />
      {listeningField === 'imageUrl' && (
        <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
          Listening... Speak now.
        </Typography>
      )}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Selected Colors</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1, minHeight: '48px' }}>
        {formData.colors.length > 0 ? formData.colors.map((color) => (
          <Chip
            key={color}
            label={color}
            onDelete={() => handleColorSelect(color)}
          />
        )) : <Typography variant="body2" color="text.secondary" sx={{p: 1}}>No colors selected.</Typography>}
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Choose from Available Colors</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {AVAILABLE_COLORS.map((color) => (
          <Chip
            key={color}
            label={color}
            onClick={() => handleColorSelect(color)}
            variant={formData.colors.includes(color) ? 'filled' : 'outlined'}
            color={formData.colors.includes(color) ? 'primary' : 'default'}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Size Presets</Typography>
      <ButtonGroup variant="outlined" aria-label="size presets" sx={{ mb: 2 }}>
        <Button onClick={() => handleSizePresetChange('adult')}>Adult</Button>
        <Button onClick={() => handleSizePresetChange('boy')}>Boy</Button>
        <Button onClick={() => handleSizePresetChange('toddler')}>Toddler</Button>
      </ButtonGroup>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Sizes</Typography>
      {formData.sizes && formData.sizes.map((size, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            label="Size"
            value={size.size}
            disabled
            sx={{ mr: 2, width: '100px' }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={size.quantity}
            onChange={(e) => handleSizeQuantityChange(index, e.target.value)}
            inputProps={{ 'data-testid': `quantity-input-${size.size}` }}
            sx={{ width: '100px' }}
          />
        </Box>
      ))}

      {!isEditMode && (
        <>
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Stock Information
          </Typography>
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
                    onStateChange={(state) => setListeningField(state === 'listening' ? 'batchNumber' : null)}
                  />
                </InputAdornment>
              ),
            }}
          />
          {listeningField === 'batchNumber' && (
            <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
              Listening... Speak now.
            </Typography>
          )}
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
                    onStateChange={(state) => setListeningField(state === 'listening' ? 'expiryDate' : null)}
                  />
                </InputAdornment>
              ),
            }}
          />
          {listeningField === 'expiryDate' && (
            <Typography variant="caption" color="secondary" sx={{ pl: 2 }}>
              Listening... Speak now.
            </Typography>
          )}
          <TextField
            margin="normal"
            id="createdDate"
            name="createdDate"
            label="Created Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.createdDate}
            onChange={handleChange}
            disabled
            InputLabelProps={{ shrink: true }}
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
