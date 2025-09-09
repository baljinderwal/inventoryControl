import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { supplierService } from '../../services/supplierService';
import { stockService } from '../../services/stockService';
import { poService } from '../../services/poService';
import AppDialog from '../../components/ui/AppDialog';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Paper,
} from '@mui/material';
import { Add, Delete, Lightbulb, QrCodeScanner } from '@mui/icons-material';
import BarcodeScanner from '../../components/ui/BarcodeScanner';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { getSizePreset } from '../../utils/sizePresets';


const AddEditPOForm = ({ open, onClose, po }) => {
  const isEditMode = Boolean(po);
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [supplierId, setSupplierId] = useState('');
  const [productsList, setProductsList] = useState([{ productId: '', quantity: 1, size: null }]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (open) { // Reset state when dialog opens
      if (isEditMode && po) {
        setSupplierId(po.supplier.id || '');
        setProductsList(po.products.map(p => ({ productId: p.productId, quantity: p.quantity, size: p.size || null })));
      } else {
        setSupplierId('');
        setProductsList([{ productId: '', quantity: 1, size: null }]);
      }
    }
  }, [po, isEditMode, open]);

  useEffect(() => {
    // When supplier changes, reset the products list to prevent invalid combinations.
    // Use a ref to skip the very first render.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Do not run on initial mount when supplierId is empty in create mode
    if (supplierId) {
      setProductsList([{ productId: '', quantity: 1, size: null }]);
    }
  }, [supplierId]);

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({ queryKey: ['suppliers'], queryFn: supplierService.getSuppliers });
  const { data: products, isLoading: isLoadingProducts } = useQuery({ queryKey: ['stock'], queryFn: stockService.getStockLevels });

  const lowStockProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.stock <= p.lowStockThreshold);
  }, [products]);

  const availableProducts = useMemo(() => {
    if (!supplierId) return products || [];
    if (!suppliers || !products) return [];

    const selectedSupplier = suppliers.find(s => s.id === supplierId);
    if (!selectedSupplier || !selectedSupplier.products) {
      return [];
    }

    const supplierProductIds = new Set(selectedSupplier.products);
    return products.filter(p => supplierProductIds.has(p.id));
  }, [supplierId, suppliers, products]);

  const handleAddFromSuggestion = (product) => {
    if (productsList.some(p => p.productId === product.id)) {
      showNotification(`${product.name} is already in the list.`, 'info');
      return;
    }

    const sizes = product.sizeProfile ? getSizePreset(product.sizeProfile) : [];

    if (sizes.length > 0) {
      const newProducts = sizes.map(size => ({
        productId: product.id,
        quantity: 1, // Default quantity for each size
        size: size,
      }));
      setProductsList(prev => [...prev.filter(p => p.productId), ...newProducts]);
    } else {
      const newProduct = {
        productId: product.id,
        quantity: product.lowStockThreshold * 2 || 20,
        size: null
      };
      if (productsList.length === 1 && !productsList[0].productId) {
        setProductsList([newProduct]);
      } else {
        setProductsList([...productsList, newProduct]);
      }
    }
  };

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      showNotification(`Purchase Order ${isEditMode ? 'updated' : 'created'} successfully!`, 'success');
      onClose();
    },
    onError: (error) => {
      showNotification(`Error: ${error.message}`, 'error');
    },
  };

  const addPOMutation = useMutation({
    mutationFn: poService.addPO,
    ...mutationOptions,
  });

  const updatePOMutation = useMutation({
    mutationFn: (poData) => poService.updatePO(po.id, poData),
    ...mutationOptions,
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...productsList];

    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      if (product && product.sizeProfile) {
        const sizes = getSizePreset(product.sizeProfile);
        if (sizes.length > 0) {
          const newSizedProducts = sizes.map(size => ({
            productId: product.id,
            quantity: 1,
            size: size,
          }));
          // Replace the current item with the new sized products
          newProducts.splice(index, 1, ...newSizedProducts);
          setProductsList(newProducts);
          return;
        }
      }
    }

    // Default behavior
    newProducts[index][field] = value;
    if (field === 'productId') {
        newProducts[index]['size'] = null; // Reset size if a non-sized product is selected
    }
    setProductsList(newProducts);
  };

  const handleAddProduct = () => setProductsList([...productsList, { productId: '', quantity: 1, size: null }]);

  const handleRemoveProduct = (index) => {
    if (productsList.length > 1) {
      setProductsList(productsList.filter((_, i) => i !== index));
    }
  };

  const handleScan = (scannedBarcode) => {
    setIsScannerOpen(false);
    const product = products?.find(p => p.barcode === scannedBarcode);
    if (product) {
      handleAddFromSuggestion(product);
      showNotification(`Scanned and added: ${product.name}`, 'success');
    } else {
      showNotification(`Product with barcode ${scannedBarcode} not found.`, 'error');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validProducts = productsList
      .map(item => ({
        productId: (item.productId),
        quantity: Number(item.quantity) || 0,
        size: item.size || null,
      }))
      .filter(item => item.productId && item.quantity > 0);

    if (!supplierId || validProducts.length === 0) {
      showNotification('Please select a supplier and add at least one valid product.', 'warning');
      return;
    }

    const supplier = suppliers?.find(s => s.id === (supplierId));
    if (!supplier) {
      showNotification('Could not find supplier details. Please refresh and try again.', 'error');
      return;
    }

    const poData = {
      supplierId: supplierId,
      supplier: { id: supplier.id, name: supplier.name },
      status: 'Pending',
      products: validProducts,
    };

    if (!isEditMode) {
      poData.createdAt = new Date().toISOString();
    }

    if (isEditMode) {
      updatePOMutation.mutate(poData);
    } else {
      addPOMutation.mutate(poData);
    }
  };

  const isLoadingMutation = addPOMutation.isLoading || updatePOMutation.isLoading;

  return (
    <AppDialog title={isEditMode ? `Edit PO #${po.id}` : "Create New Purchase Order"} open={open} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Order Details
        </Typography>
        
        <FormControl fullWidth margin="normal" required disabled={isEditMode}>
          <InputLabel>Supplier</InputLabel>
          <Select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} label="Supplier">
            {isLoadingSuppliers ? <CircularProgress size={24} /> : suppliers?.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </Select>
        </FormControl>

        {!isEditMode && (
          <Box sx={{ my: 2 }}>
            <Button startIcon={<Badge badgeContent={lowStockProducts.length} color="warning"><Lightbulb /></Badge>} onClick={() => setShowSuggestions(!showSuggestions)} disabled={lowStockProducts.length === 0}>
              {showSuggestions ? 'Hide' : 'Show'} Reorder Suggestions
            </Button>
            {showSuggestions && (
              <Paper variant="outlined" sx={{ mt: 1 }}>
                <List dense>
                  {lowStockProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                      <ListItem secondaryAction={<Button edge="end" size="small" onClick={() => handleAddFromSuggestion(p)}>Add</Button>}>
                        <ListItemText primary={p.name} secondary={`Stock: ${p.stock} | Threshold: ${p.lowStockThreshold}`} />
                      </ListItem>
                      {index < lowStockProducts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        )}

        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: 'text.primary' }}>Products</Typography>
        {productsList.map((productItem, index) => (
          <Box key={`${productItem.productId}-${productItem.size || index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 4 }} required>
              <InputLabel>Product</InputLabel>
              <Select
                value={productItem.productId}
                onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                label="Product"
                disabled={!supplierId || !!productItem.size}
              >
                {isLoadingProducts ? <CircularProgress size={24} /> : availableProducts.map(p => <MenuItem key={p.id} value={p.id}>{p.name} (In Stock: {p.stock})</MenuItem>)}
              </Select>
            </FormControl>
            {productItem.size && (
              <TextField
                label="Size"
                value={productItem.size}
                disabled
                sx={{ flex: 1 }}
              />
            )}
            <TextField
              label="Quantity"
              type="number"
              value={productItem.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value, 10))}
              required sx={{ flex: 1 }}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <IconButton onClick={() => handleRemoveProduct(index)} disabled={productsList.length === 1}><Delete /></IconButton>
          </Box>
        ))}
        <Button startIcon={<Add />} onClick={handleAddProduct}>Add Product</Button>
        <Button startIcon={<QrCodeScanner />} onClick={() => setIsScannerOpen(true)} sx={{ ml: 1 }}>
            Scan Product
        </Button>

        <Dialog open={isScannerOpen} onClose={() => setIsScannerOpen(false)}>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogContent>
            {isScannerOpen && <BarcodeScanner onScan={handleScan} />}
            </DialogContent>
        </Dialog>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoadingMutation}>
            {isLoadingMutation ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update PO' : 'Create PO')}
          </Button>
        </Box>
      </form>
    </AppDialog>
  );
};

export default AddEditPOForm;
