import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliers } from '../../services/supplierService';
import { getProducts } from '../../services/productService';
import { addOrder, updateOrder } from '../../services/orderService';
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

const AddEditOrderForm = ({ open, onClose, order }) => {
  const isEditMode = Boolean(order);
  const queryClient = useQueryClient();
  const showNotification = useNotification();

  const [supplierId, setSupplierId] = useState('');
  const [productsList, setProductsList] = useState([{ productId: '', quantity: 1 }]);

  useEffect(() => {
    if (isEditMode) {
      setSupplierId(order.supplierId || '');
      setProductsList(order.products.map(p => ({ productId: p.productId, quantity: p.quantity })));
    } else {
      // Reset form for new entry
      setSupplierId('');
      setProductsList([{ productId: '', quantity: 1 }]);
    }
  }, [order, isEditMode, open]); // re-run when dialog opens

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({ queryKey: ['suppliers'], queryFn: getSuppliers });
  const { data: products, isLoading: isLoadingProducts } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showNotification(`Order ${isEditMode ? 'updated' : 'created'} successfully!`, 'success');
      onClose();
    },
    onError: (error) => {
      showNotification(`Error: ${error.message}`, 'error');
    },
  };

  const addOrderMutation = useMutation({
    mutationFn: addOrder,
    ...mutationOptions,
  });

  const updateOrderMutation = useMutation({
    mutationFn: (orderData) => updateOrder(order.id, orderData),
    ...mutationOptions,
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...productsList];
    newProducts[index][field] = value;
    setProductsList(newProducts);
  };

  const handleAddProduct = () => {
    setProductsList([...productsList, { productId: '', quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    if (productsList.length > 1) {
      const newProducts = productsList.filter((_, i) => i !== index);
      setProductsList(newProducts);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const orderData = {
      supplierId: parseInt(supplierId),
      status: 'Pending',
      products: productsList.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity) || 0,
      })).filter(item => item.productId && item.quantity > 0),
    };

    if (!isEditMode) {
      orderData.createdAt = new Date().toISOString();
    }

    if (!orderData.supplierId || orderData.products.length === 0) {
      showNotification('Please select a supplier and add at least one valid product.', 'warning');
      return;
    }

    if (isEditMode) {
      updateOrderMutation.mutate(orderData);
    } else {
      addOrderMutation.mutate(orderData);
    }
  };

  const isLoading = addOrderMutation.isLoading || updateOrderMutation.isLoading;

  return (
    <AppDialog title={isEditMode ? `Edit Order #${order.id}` : "Create New Purchase Order"} open={open} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required disabled={isEditMode}>
          <InputLabel>Supplier</InputLabel>
          <Select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            label="Supplier"
          >
            {isLoadingSuppliers ? <CircularProgress size={24} /> : suppliers?.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Products</Typography>

        {productsList.map((productItem, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 4 }} required>
              <InputLabel>Product</InputLabel>
              <Select
                value={productItem.productId}
                onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                label="Product"
              >
                {isLoadingProducts ? <CircularProgress size={24} /> : products?.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name} (In Stock: {p.stock})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={productItem.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              required
              sx={{ flex: 1 }}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <IconButton onClick={() => handleRemoveProduct(index)} disabled={productsList.length === 1}>
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Button startIcon={<Add />} onClick={handleAddProduct}>
          Add Product
        </Button>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Order' : 'Create Order')}
          </Button>
        </Box>
      </form>
    </AppDialog>
  );
};

export default AddEditOrderForm;
