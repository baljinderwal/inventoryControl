import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
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


const AddEditPOForm = ({ open, onClose, po }) => {
  const isEditMode = Boolean(po);
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [supplierId, setSupplierId] = useState('');
  const [productsList, setProductsList] = useState([{ productId: '', quantity: 1 }]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (open) { // Reset state when dialog opens
      if (isEditMode && po) {
        setSupplierId(po.supplier.id || '');
        setProductsList(po.products.map(p => ({ productId: p.productId, quantity: p.quantity })));
      } else {
        setSupplierId('');
        setProductsList([{ productId: '', quantity: 1 }]);
      }
    }
  }, [po, isEditMode, open]);

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({ queryKey: ['suppliers', mode], queryFn: services.suppliers.getSuppliers });
  const { data: products, isLoading: isLoadingProducts } = useQuery({ queryKey: ['stock', mode], queryFn: services.stock.getStockLevels });

  const lowStockProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.stock <= p.lowStockThreshold);
  }, [products]);

  const handleAddFromSuggestion = (product) => {
    if (productsList.some(p => p.productId === product.id)) {
      showNotification(`${product.name} is already in the list.`, 'info');
      return;
    }
    const newProduct = { productId: product.id, quantity: product.lowStockThreshold * 2 || 20 };
    if (productsList.length === 1 && !productsList[0].productId) {
      setProductsList([newProduct]);
    } else {
      setProductsList([...productsList, newProduct]);
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
    mutationFn: services.po.addPO,
    ...mutationOptions,
  });

  const updatePOMutation = useMutation({
    mutationFn: (poData) => services.po.updatePO(po.id, poData),
    ...mutationOptions,
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...productsList];
    newProducts[index][field] = value;
    setProductsList(newProducts);
  };

  const handleAddProduct = () => setProductsList([...productsList, { productId: '', quantity: 1 }]);

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
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity) || 0,
      }))
      .filter(item => item.productId && item.quantity > 0);

    if (!supplierId || validProducts.length === 0) {
      showNotification('Please select a supplier and add at least one valid product.', 'warning');
      return;
    }

    const supplier = suppliers?.find(s => s.id === parseInt(supplierId));
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

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Products</Typography>
        {productsList.map((productItem, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 4 }} required>
              <InputLabel>Product</InputLabel>
              <Select value={productItem.productId} onChange={(e) => handleProductChange(index, 'productId', e.target.value)} label="Product">
                {isLoadingProducts ? <CircularProgress size={24} /> : products?.map(p => <MenuItem key={p.id} value={p.id}>{p.name} (In Stock: {p.stock})</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Quantity" type="number" value={productItem.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} required sx={{ flex: 1 }} InputProps={{ inputProps: { min: 1 } }} />
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
