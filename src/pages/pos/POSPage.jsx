import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import BarcodeScanner from '../../components/ui/BarcodeScanner';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF';

const POSPage = () => {
  const { mode, services } = useApi();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Data fetching
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers', mode],
    queryFn: () => services.customers.getCustomers(),
  });

  const { data: stock, isLoading: isLoadingStock } = useQuery({
    queryKey: ['stock', mode],
    queryFn: () => services.stock.getStockLevels(),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (saleData) => {
      // 1. Create Sales Order
      const soData = {
        customerId: saleData.customerId,
        customerName: saleData.customerName,
        status: 'Completed',
        items: saleData.items,
        total: saleData.total,
        createdAt: new Date().toISOString(),
      };
      const newSO = await services.salesOrders.addSalesOrder(soData);

      // 2. Adjust Stock Levels for each item
      // In a real-world scenario, this would be a single backend transaction
      await Promise.all(
        saleData.items.map(item =>
          services.stock.adjustStockLevel({
            productId: item.id,
            quantity: -item.quantity,
          })
        )
      );

      // 3. Create Invoice
      const invoiceData = {
        salesOrderId: newSO.id,
        customerId: newSO.customerId,
        customerName: newSO.customerName,
        items: newSO.items,
        total: newSO.total,
        status: 'Paid', // Assuming immediate payment in POS context
        invoiceDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
      };
      const newInvoice = await services.invoices.createInvoice(invoiceData);

      return { newSO, newInvoice };
    },
    onSuccess: ({ newInvoice }) => {
      showNotification('Sale completed successfully!', 'success');

      // 4. Generate PDF
      const customer = customerList.find(c => c.id === newInvoice.customerId);
      generateInvoicePDF(newInvoice, customer || { name: 'Walk-in Customer' });

      // 5. Reset State
      setCart([]);
      setSelectedCustomerId('walk-in');

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      showNotification(`Checkout failed: ${error.message}`, 'error');
    },
  });

  // Derived data
  const customerList = useMemo(() => {
    if (!customers) return [];
    // Add a "Walk-in Customer" option
    return [{ id: 'walk-in', name: 'Walk-in Customer' }, ...customers];
  }, [customers]);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Handlers
  const handleAddToCart = () => {
    if (!selectedProduct) {
      showNotification('Please select a product.', 'warning');
      return;
    }

    const existingItem = cart.find(item => item.id === selectedProduct.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...selectedProduct, quantity: 1 }]);
    }
    setSelectedProduct(null); // Reset autocomplete
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    const numQuantity = Number(quantity);
    if (numQuantity > 0) {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: numQuantity } : item));
    }
  };

  const onBarcodeDetect = (barcode) => {
    const product = stock.find(p => p.barcode === barcode);
    if (product) {
      // Logic to add to cart directly can be complex if we need to select a product first
      // For now, let's find it and set it as selected
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
      showNotification(`Added ${product.name} to cart.`, 'success');
    } else {
      showNotification('Product not found for this barcode.', 'error');
    }
  };

  const handleFinalizeAndPrint = () => {
    if (cart.length === 0 || !selectedCustomerId) {
      showNotification('Please add products to the cart and select a customer.', 'warning');
      return;
    }

    const customer = customerList.find(c => c.id === selectedCustomerId);
    const saleData = {
      customerId: selectedCustomerId === 'walk-in' ? null : selectedCustomerId,
      customerName: customer ? customer.name : 'Walk-in Customer',
      items: cart.map(item => ({
        id: item.id,
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
    };

    checkoutMutation.mutate(saleData);
  };

  useEffect(() => {
    if (customerList.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId('walk-in');
    }
  }, [customerList, selectedCustomerId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Point of Sale</Typography>
      <Grid container spacing={3}>
        {/* Left Panel: Product and Customer Selection */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Details</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Customer</InputLabel>
              <Select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                label="Customer"
                disabled={isLoadingCustomers}
              >
                {customerList.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Autocomplete
                    sx={{ flexGrow: 1 }}
                    options={stock || []}
                    getOptionLabel={(option) => `${option.name} (In Stock: ${option.stock})`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={selectedProduct}
                    onChange={(event, newValue) => setSelectedProduct(newValue)}
                    renderInput={(params) => <TextField {...params} label="Search Product" variant="outlined" />}
                    loading={isLoadingStock}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          <Grid container justifyContent="space-between">
                            <Grid item>{option.name}</Grid>
                            <Grid item><Typography color="text.secondary">Stock: {option.stock}</Typography></Grid>
                          </Grid>
                        </li>
                      )}
                />
                <Button variant="contained" onClick={handleAddToCart} startIcon={<Add />} sx={{ height: '56px' }}>Add</Button>
            </Box>

            <Box sx={{ my: 2 }}>
                <BarcodeScanner onDetected={onBarcodeDetect} />
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel: Cart */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Cart</Typography>
            <List>
              {cart.map(item => (
                <ListItem key={item.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(item.id)}>
                    <Delete />
                  </IconButton>
                }>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price.toFixed(2)}`}
                  />
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    sx={{ width: '80px', mx: 2 }}
                    inputProps={{ min: 1 }}
                  />
                </ListItem>
              ))}
              {cart.length === 0 && <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>Cart is empty</Typography>}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Total:</Typography>
              <Typography variant="h5">{`$${total.toFixed(2)}`}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={handleFinalizeAndPrint}
              disabled={cart.length === 0 || !selectedCustomerId || checkoutMutation.isLoading}
            >
              {checkoutMutation.isLoading ? 'Processing...' : 'Finalize & Print Invoice'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POSPage;
