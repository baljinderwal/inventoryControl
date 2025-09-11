import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { useNotificationCenter } from '../../utils/NotificationCenterContext';
import { customerService } from '../../services/customerService';
import { stockService } from '../../services/stockService';
import { salesOrderService } from '../../services/salesOrderService';
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
import { Add, Delete, PersonAddAlt1 as PersonAddIcon } from '@mui/icons-material';
import AddEditCustomerForm from '../customers/AddEditCustomerForm';

const AddEditSOForm = ({ open, onClose, so }) => {
  const isEditMode = Boolean(so);
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { addNotification } = useNotificationCenter();

  const [customerId, setCustomerId] = useState('');
  const [productsList, setProductsList] = useState([{ productId: '', quantity: 1, size: '' }]);
  const [status, setStatus] = useState('Pending');
  const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditMode && so) {
        setCustomerId(so.customerId || '');
        setProductsList(so.items.map(p => ({ productId: p.productId, quantity: p.quantity, size: p.size || '' })));
        setStatus(so.status || 'Pending');
      } else {
        setCustomerId('');
        setProductsList([{ productId: '', quantity: 1, size: '' }]);
        setStatus('Pending');
      }
    }
  }, [so, isEditMode, open]);

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({ queryKey: ['customers'], queryFn: customerService.getCustomers });
  const { data: products, isLoading: isLoadingProducts } = useQuery({ queryKey: ['stock'], queryFn: stockService.getStockLevels });

  const mutationOptions = {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      showNotification(`Sales Order ${isEditMode ? 'updated' : 'created'} successfully!`, 'success');
      if (!isEditMode) {
        addNotification({
            message: `New Sales Order #${data.id} created for ${data.customerName}.`,
            type: 'NEW_SO',
            refId: data.id,
        });
      }
      onClose();
    },
    onError: (error) => {
      showNotification(`Error: ${error.message}`, 'error');
    },
  };

  const addSOMutation = useMutation({
    mutationFn: salesOrderService.addSalesOrder,
    ...mutationOptions,
  });

  const updateSOMutation = useMutation({
    mutationFn: (soData) => salesOrderService.updateSalesOrder(so.id, soData),
    ...mutationOptions,
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...productsList];
    newProducts[index][field] = value;

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      const availableSizes = product?.sizes?.filter(s => s.quantity > 0) || [];
      newProducts[index].size = availableSizes.length > 0 ? availableSizes[0].size : '';
    }
    setProductsList(newProducts);
  };

  const handleAddProduct = () => setProductsList([...productsList, { productId: '', quantity: 1, size: '' }]);

  const handleRemoveProduct = (index) => {
    if (productsList.length > 1) {
      setProductsList(productsList.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerId || productsList.some(p => !p.productId || !p.quantity)) {
      showNotification('Please select a customer and add at least one valid product with quantity.', 'warning');
      return;
    }

    if (productsList.some(p => {
      const product = products.find(prod => prod.id === p.productId);
      return product && product.sizes && product.sizes.length > 0 && !p.size;
    })) {
      showNotification('Please select a size for all products that require it.', 'warning');
      return;
    }

    const customer = customers?.find(c => c.id === customerId);
    const items = productsList.map(item => {
      const product = products.find(p => p.id === (item.productId));
      return {
        productId: (item.productId),
        productName: product?.name || '',
        quantity: Number(item.quantity) || 0,
        price: product?.price || 0,
        size: item.size,
      }
    }).filter(item => item.productId && item.quantity > 0);

    if (items.length === 0) {
        showNotification('Please add at least one valid product.', 'warning');
        return;
    }

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const soData = {
      customerId: customerId,
      customerName: customer?.name || 'Unknown Customer',
      status: status,
      items,
      total,
    };

    if (soData.status === 'Completed' && (!isEditMode || (isEditMode && so.status !== 'Completed'))) {
      try {
        await Promise.all(items.map(async (item) => {
          const product = products.find(p => p.id === item.productId);
          const stockAdjustments = [];
          if (item.size) {
            const sizeStock = product.sizes.find(s => s.size === item.size)?.quantity || 0;
            if (sizeStock < item.quantity) {
              throw new Error(`Not enough stock for ${item.productName} (Size: ${item.size}). Required: ${item.quantity}, Available: ${sizeStock}`);
            }
            // This is a placeholder for a real batch number. In a real app, this would be more sophisticated.
            const batchNumber = product.batches.find(b => b.sizes.some(s => s.size === item.size && s.quantity > 0))?.batchNumber;
            if (!batchNumber) {
              throw new Error(`No batch found with available stock for ${item.productName} (Size: ${item.size})`);
            }
            stockAdjustments.push(stockService.adjustStockLevel({
              productId: item.productId,
              batchNumber,
              sizes: [{ size: item.size, quantity: -item.quantity }],
            }));
          } else {
            if (product.stock < item.quantity) {
              throw new Error(`Not enough stock for ${item.productName}. Required: ${item.quantity}, Available: ${product.stock}`);
            }
            const batchNumber = product.batches.find(b => b.quantity > 0)?.batchNumber;
             if (!batchNumber) {
              throw new Error(`No batch found with available stock for ${item.productName}`);
            }
            stockAdjustments.push(stockService.adjustStockLevel({
              productId: item.productId,
              batchNumber,
              quantity: -item.quantity,
            }));
          }
          return Promise.all(stockAdjustments);
        }));

        queryClient.invalidateQueries({ queryKey: ['stock'] });
      } catch (error) {
        showNotification(`Error adjusting stock: ${error.message}`, 'error');
        return;
      }
    }

    if (!isEditMode) {
      soData.createdAt = new Date().toISOString();
    }

    if (isEditMode) {
      updateSOMutation.mutate(soData);
    } else {
      addSOMutation.mutate(soData);
    }
  };

  const isLoadingMutation = addSOMutation.isLoading || updateSOMutation.isLoading;

  const handleCustomerDialogClose = (newCustomer) => {
    setAddCustomerOpen(false);
    if (newCustomer && newCustomer.id) {
      // The useQuery for customers will refetch automatically due to query invalidation in AddEditCustomerForm.
      // We can then set the new customer.
       queryClient.invalidateQueries({ queryKey: ['customers'] }).then(() => {
        setCustomerId(newCustomer.id);
      });
    }
  };

  return (
    <>
      <AppDialog title={isEditMode ? `Edit SO #${so.id}` : "Create New Sales Order"} open={open} onClose={onClose} maxWidth="md">
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <FormControl fullWidth required disabled={isEditMode}>
              <InputLabel>Customer</InputLabel>
              <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} label="Customer">
                {isLoadingCustomers ? <CircularProgress size={24} /> : customers?.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <IconButton onClick={() => setAddCustomerOpen(true)} color="primary" disabled={isEditMode}>
              <PersonAddIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
            </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Products</Typography>
        {productsList.map((productItem, index) => {
          const selectedProduct = products?.find(p => p.id === productItem.productId);
          const availableSizes = selectedProduct?.sizes?.filter(s => s.quantity > 0) || [];

          return (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <FormControl sx={{ flex: 4 }} required>
                <InputLabel>Product</InputLabel>
                <Select value={productItem.productId} onChange={(e) => handleProductChange(index, 'productId', e.target.value)} label="Product">
                  {isLoadingProducts ? <CircularProgress size={24} /> : products?.map(p => <MenuItem key={p.id} value={p.id}>{p.name} (In Stock: {p.stock})</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 2 }} required disabled={availableSizes.length === 0}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={productItem.size}
                  onChange={(e) => handleProductChange(index, 'size', e.target.value)}
                  label="Size"
                >
                  {availableSizes.map(s => (
                    <MenuItem key={s.size} value={s.size}>
                      {s.size} (In Stock: {s.quantity})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Quantity" type="number" value={productItem.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} required sx={{ flex: 1 }} variant="outlined" margin="normal" InputProps={{ inputProps: { min: 1 } }} />
              <IconButton onClick={() => handleRemoveProduct(index)} disabled={productsList.length === 1}><Delete /></IconButton>
            </Box>
          );
        })}
        <Button startIcon={<Add />} onClick={handleAddProduct}>Add Product</Button>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoadingMutation}>
            {isLoadingMutation ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update SO' : 'Create SO')}
          </Button>
        </Box>
      </form>
    </AppDialog>
    <AppDialog open={isAddCustomerOpen} onClose={() => handleCustomerDialogClose(null)} title="Add New Customer">
        <AddEditCustomerForm onClose={handleCustomerDialogClose} />
    </AppDialog>
    </>
  );
};

export default AddEditSOForm;
