import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { supplierService } from '../../services/supplierService';
import { productService } from '../../services/productService';
import { stockService } from '../../services/stockService';
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
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VoiceRecognition from '../../components/ui/VoiceRecognition';
import SmartVoiceAdd from '../../components/ui/SmartVoiceAdd';
import GuidedVoiceAdd from '../../components/ui/GuidedVoiceAdd';
import { generateBarcode } from '../../utils/barcodeGenerator';
import { generateSku } from '../../utils/skuGenerator';
import AppDialog from '../../components/ui/AppDialog';
import AddEditSupplierForm from '../suppliers/AddEditSupplierForm';

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

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getSuppliers(),
  });

  const [listeningField, setListeningField] = useState(null);
  const [inputMode, setInputMode] = useState('voicePerField');
  const [startGuidedVoice, setStartGuidedVoice] = useState(false);
  const [expanded, setExpanded] = useState('product-details');
  const [priceMultiplier, setPriceMultiplier] = useState(1.5);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [addStock, setAddStock] = useState(false);
  const [isAddSupplierDialogOpen, setAddSupplierDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: generateSku(),
    barcode: '',
    category: '',
    brand: '',
    model: '',
    sizeProfile: 'adult',
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
    supplierId: '',
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
        sizeProfile: product.sizeProfile || 'adult',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        sizeProfile: formData.sizeProfile,
        gender: formData.gender,
        weight: formData.weight,
        countryOfOrigin: formData.countryOfOrigin,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        discountedPrice: parseFloat(formData.discountedPrice) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 0,
        imageUrl: formData.imageUrl,
        colors: formData.colors,
      };

      if (isEditMode) {
        // In edit mode, we just update and invalidate.
        await productService.updateProduct(product.id, productData);
        showNotification('Product updated successfully', 'success');
        queryClient.invalidateQueries({ queryKey: ['stock'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        // In add mode, we manually update the cache for an instant UI update.
        const productResponse = await productService.addProduct(productData);

        let newStockQuantity = 0;
        let newStockBatches = [];
        let supplierName = '';

        if (addStock) {
          const sizes = formData.sizes || [];
          const totalQuantity = sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
          const stockData = {
            productId: productResponse.id,
            supplierId: formData.supplierId,
            quantity: totalQuantity,
            batchNumber: formData.batchNumber,
            expiryDate: formData.expiryDate,
            sizes: sizes,
            createdDate: formData.createdDate,
          };
          await stockService.addStock(stockData);

          newStockQuantity = totalQuantity;
          newStockBatches = [{ ...stockData, supplierId: formData.supplierId }];

          if (formData.supplierId && suppliers) {
            const foundSupplier = suppliers.find(s => s.id === formData.supplierId);
            if (foundSupplier) supplierName = foundSupplier.name;
          }
        }

        // Manually construct the new product object to match the structure in the query cache.
        const newProductForCache = {
          ...productData,
          id: productResponse.id, // The most important part from the response
          stock: newStockQuantity,
          batches: newStockBatches,
          supplierName: supplierName,
          // Ensure all other expected fields are present, even if empty.
          ...productResponse,
        };

        // Optimistically update the cache
        queryClient.setQueryData(['stock'], (oldData) => {
          return oldData ? [...oldData, newProductForCache] : [newProductForCache];
        });

        // Still invalidate to trigger a background refetch for eventual consistency.
        queryClient.invalidateQueries({ queryKey: ['stock'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });

        showNotification('Product added successfully', 'success');
      }

      onClose();

    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    if (panel === 'add-stock' && !addStock) {
      return;
    }
    setExpanded(isExpanded ? panel : false);
  };

  const handleStockToggle = (event) => {
    const isChecked = event.target.checked;
    setAddStock(isChecked);
    if (isChecked) {
      setExpanded('add-stock');
    } else {
      setExpanded(false);
    }
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

  const handleSizeChange = (index, size) => {
    const newSizes = [...formData.sizes];
    newSizes[index].size = size;
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleDeleteSize = (index) => {
    const newSizes = [...formData.sizes];
    newSizes.splice(index, 1);
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', quantity: 1 }],
    }));
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
      
      <Accordion expanded={expanded === 'product-details'} onChange={handleAccordionChange('product-details')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="product-details-content" id="product-details-header">
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Product details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Basic Information */}
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
                  <IconButton onClick={handleGenerateSku} aria-label="generate sku">
                    <RefreshIcon />
                  </IconButton>
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
                  <IconButton onClick={handleGenerateBarcode} aria-label="generate barcode">
                    <RefreshIcon />
                  </IconButton>
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

          <FormControl fullWidth margin="normal">
            <InputLabel id="size-profile-label">Size Profile</InputLabel>
            <Select
              labelId="size-profile-label"
              id="size-profile"
              name="sizeProfile"
              value={formData.sizeProfile}
              label="Size Profile"
              onChange={(e) => {
                handleChange(e);
                handleSizePresetChange(e.target.value);
              }}
            >
              <MenuItem value="adult">Adult</MenuItem>
              <MenuItem value="boy">Boy</MenuItem>
              <MenuItem value="toddler">Toddler</MenuItem>
            </Select>
          </FormControl>

          {/* Sales & Pricing */}
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

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              margin="normal"
              id="price"
              name="price"
              label="Retail Price"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.price}
              onChange={handleChange}
              required
              helperText="Calculated as Cost Price × Multiplier"
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
              label="Price Multiplier"
              type="number"
              value={priceMultiplier}
              onChange={(e) => setPriceMultiplier(parseFloat(e.target.value) || 0)}
              InputProps={{
                endAdornment: <InputAdornment position="end">x</InputAdornment>,
              }}
              sx={{width: '250px', mt: 2}}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
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
              helperText="Calculated from Retail Price and Discount %"
              inputProps={{ 'data-testid': 'discountedPrice-input' }}
            />
            <TextField
              margin="normal"
              label="Discount"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{width: '250px', mt: 2}}
            />
          </Box>
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
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'additional-details'} onChange={handleAccordionChange('additional-details')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="additional-details-content" id="additional-details-header">
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Additional details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Supplier & Logistics */}
          {/* Variant Attributes */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Colors</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1, minHeight: '48px' }}>
            {formData.colors.length > 0 ? formData.colors.map((color) => (
              <Chip
                key={color}
                label={color}
                onDelete={() => handleColorSelect(color)}
              />
            )) : <Typography variant="body2" color="text.secondary" sx={{p: 1}}>No colors selected.</Typography>}
          </Box>
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
            id="weight"
            name="weight"
            label="Weight (grams)"
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

          {/* Description & Media */}
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
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'add-stock'} onChange={handleAccordionChange('add-stock')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: addStock ? 'inherit' : 'text.disabled' }} />}
          aria-controls="add-stock-content"
          id="add-stock-header"
          sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: addStock ? 'text.primary' : 'text.disabled', flexGrow: 1 }}>
            Add Stock
          </Typography>
          <Switch
            checked={addStock}
            onChange={handleStockToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </AccordionSummary>
        <AccordionDetails>
          <fieldset disabled={!addStock} style={{ border: 'none', padding: 0, margin: 0 }}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Sizes & Quantity</Typography>
            {formData.sizes && formData.sizes.map((size, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Size"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
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
                <IconButton onClick={() => handleDeleteSize(index)} aria-label="delete size">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddSize} variant="outlined" sx={{ mt: 1 }}>
              Add Size
            </Button>

            {!isEditMode && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormControl fullWidth margin="normal" disabled={!addStock}>
                    <InputLabel id="supplier-label">Supplier</InputLabel>
                    <Select
                      labelId="supplier-label"
                      id="supplierId"
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      label="Supplier"
                    >
                      {suppliers?.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button onClick={() => setAddSupplierDialogOpen(true)} variant="outlined" sx={{ mt: 1, whiteSpace: 'nowrap' }}>
                    Add New
                  </Button>
                </Box>
              <AppDialog
                open={isAddSupplierDialogOpen}
                onClose={() => setAddSupplierDialogOpen(false)}
                title="Add New Supplier"
              >
                <AddEditSupplierForm
                  onSupplierAdded={(newSupplier) => {
                    setAddSupplierDialogOpen(false);
                    queryClient.invalidateQueries(['suppliers']);
                    setFormData((prev) => ({ ...prev, supplierId: newSupplier.id }));
                  }}
                  onClose={() => setAddSupplierDialogOpen(false)}
                />
              </AppDialog>
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
              </>
            )}
          </fieldset>
        </AccordionDetails>
      </Accordion>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : (isEditMode ? 'Update Product' : 'Add Product')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddEditProductForm;
