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
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const AddEditSOForm = ({ open, onClose, so }) => {
  const isEditMode = Boolean(so);
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [customerId, setCustomerId] = useState('');
  const [productsList, setProductsList] = useState([{ productId: '', quantity: 1 }]);
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (open) {
      if (isEditMode && so) {
        setCustomerId(so.customerId || '');
        setProductsList(so.items.map(p => ({ productId: p.productId, quantity: p.quantity })));
        setStatus(so.status || 'Pending');
      } else {
        setCustomerId('');
        setProductsList([{ productId: '', quantity: 1 }]);
        setStatus('Pending');
      }
    }
  }, [so, isEditMode, open]);

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({ queryKey: ['customers', mode], queryFn: services.customers.getCustomers });
  const { data: products, isLoading: isLoadingProducts } = useQuery({ queryKey: ['stock', mode], queryFn: services.stock.getStockLevels });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      showNotification(`Sales Order ${isEditMode ? 'updated' : 'created'} successfully!`, 'success');
      onClose();
    },
    onError: (error) => {
      showNotification(`Error: ${error.message}`, 'error');
    },
  };

  const addSOMutation = useMutation({
    mutationFn: services.salesOrders.addSalesOrder,
    ...mutationOptions,
  });

  const updateSOMutation = useMutation({
    mutationFn: (soData) => services.salesOrders.updateSalesOrder(so.id, soData),
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const customer = customers?.find(c => c.id === customerId);
    const items = productsList.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId));
        return {
            productId: parseInt(item.productId),
            productName: product?.name || '',
            quantity: parseInt(item.quantity) || 0,
            price: product?.price || 0,
        }
    }).filter(item => item.productId && item.quantity > 0);

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const soData = {
      customerId: customerId,
      customerName: customer.name,
      status: status,
      items,
      total,
    };

    if (soData.status === 'Completed' && (!isEditMode || (isEditMode && so.status !== 'Completed'))) {
        // In a real app, this might be a single transaction on the backend
        // when an order is fulfilled.
        items.forEach(item => {
            services.stock.adjustStockLevel({
                productId: item.productId,
                quantity: -item.quantity,
                // Note: This simplified logic doesn't specify which batch to pull from.
                // A real implementation would need FEFO/FIFO logic here.
            });
        });
        // Invalidate stock query to refetch and reflect changes
        queryClient.invalidateQueries({ queryKey: ['stock'] });
    }

    if (!isEditMode) {
      soData.createdAt = new Date().toISOString();
    }

    if (!soData.customerId || soData.items.length === 0) {
      showNotification('Please select a customer and add at least one valid product.', 'warning');
      return;
    }

    if (isEditMode) {
      updateSOMutation.mutate(soData);
    } else {
      addSOMutation.mutate(soData);
    }
  };

  const isLoadingMutation = addSOMutation.isLoading || updateSOMutation.isLoading;

  return (
    <AppDialog title={isEditMode ? `Edit SO #${so.id}` : "Create New Sales Order"} open={open} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required disabled={isEditMode}>
          <InputLabel>Customer</InputLabel>
          <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} label="Customer">
            {isLoadingCustomers ? <CircularProgress size={24} /> : customers?.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
            </Select>
        </FormControl>

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

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoadingMutation}>
            {isLoadingMutation ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update SO' : 'Create SO')}
          </Button>
        </Box>
      </form>
    </AppDialog>
  );
};

export default AddEditSOForm;
