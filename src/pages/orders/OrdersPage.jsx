import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrder, deleteOrder } from '../../services/orderService';
import { getProducts, updateProduct } from '../../services/productService';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';
import MuiTable from '../../components/ui/Table';
import { Box, Typography, Button, CircularProgress, Chip, IconButton, Stack } from '@mui/material';
import { Add, CheckCircle, Delete, Edit, Download } from '@mui/icons-material';
import AddEditOrderForm from './AddEditOrderForm';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const OrdersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const queryClient = useQueryClient();
  const showNotification = useNotification();

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const { data: productsData, isSuccess: productsLoaded } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const receiveOrderMutation = useMutation({
    mutationFn: async (order) => {
      // 1. Update stock for each product in the order
      const stockUpdatePromises = order.products.map(item => {
        const product = productsData.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product with ID ${item.productId} not found`);

        const newStock = product.stock + item.quantity;
        return updateProduct(item.productId, { stock: newStock });
      });
      await Promise.all(stockUpdatePromises);

      // 2. Update the order status and completion date
      return updateOrder(order.id, { status: 'Completed', completedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showNotification('Order received and stock updated successfully!', 'success');
    },
    onError: (err) => {
      showNotification(`Error receiving order: ${err.message}`, 'error');
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showNotification('Order deleted successfully!', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting order: ${err.message}`, 'error');
    },
    onSettled: () => {
      setIsConfirmOpen(false);
      setOrderToDelete(null);
    }
  });

  const handleOpenForm = (order = null) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedOrder(null);
    setIsFormOpen(false);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsConfirmOpen(true);
  };

  const handleExport = () => {
    if (!orders || !productsLoaded) return;

    const exportData = orders.map(order => {
      const totalValue = order.products.reduce((acc, item) => {
        const product = productsData.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
      }, 0);
      const productDetails = order.products.map(p => {
        const product = productsData.find(prod => prod.id === p.productId);
        return `${product?.name || 'N/A'} (Qty: ${p.quantity})`;
      }).join(', ');

      return {
        id: order.id,
        supplier: order.supplier?.name || 'N/A',
        createdAt: order.createdAt,
        completedAt: order.completedAt || 'N/A',
        status: order.status,
        itemCount: order.products?.length || 0,
        totalValue: totalValue.toFixed(2),
        products: productDetails,
      };
    });

    const fields = ['id', 'supplier', 'createdAt', 'completedAt', 'status', 'itemCount', 'totalValue', 'products'];
    const parser = new Parser({ fields });
    const csv = parser.parse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableHeaders = ['Order ID', 'Supplier', 'Date', 'Total Value', 'Status', 'Items', 'Actions'];

  const tableData = orders?.map(order => {
    const totalValue = productsLoaded ? order.products.reduce((acc, item) => {
      const product = productsData.find(p => p.id === item.productId);
      return acc + (product?.price || 0) * item.quantity;
    }, 0) : 0;

    return {
      id: order.id,
      supplier: order.supplier?.name || 'N/A',
      date: new Date(order.createdAt).toLocaleDateString(),
      totalValue: `$${totalValue.toFixed(2)}`,
      status: (
        <Chip
          label={order.status}
          color={order.status === 'Completed' ? 'success' : 'warning'}
          size="small"
        />
      ),
      itemCount: order.products?.length || 0,
      actions: (
        <Stack direction="row" spacing={1}>
          {order.status === 'Pending' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              disabled={receiveOrderMutation.isLoading}
              onClick={() => receiveOrderMutation.mutate(order)}
            >
              Receive
            </Button>
          )}
          <IconButton size="small" onClick={() => handleOpenForm(order)} disabled={order.status === 'Completed'}>
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteClick(order)} color="error">
            <Delete fontSize="inherit" />
          </IconButton>
        </Stack>
      )
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Purchase Orders
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={!orders || orders.length === 0}
          >
            Export as CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
          >
            New Order
          </Button>
        </Stack>
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Error fetching orders: {error.message}</Typography>}

      {!isLoading && !isError && <MuiTable headers={tableHeaders} data={tableData} />}

      {isFormOpen && (
        <AddEditOrderForm
          open={isFormOpen}
          onClose={handleCloseForm}
          order={selectedOrder}
        />
      )}

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteOrderMutation.mutate(orderToDelete.id)}
        title="Delete Order"
        description={`Are you sure you want to delete order #${orderToDelete?.id}? This action cannot be undone.`}
        isLoading={deleteOrderMutation.isLoading}
      />
    </Box>
  );
};

export default OrdersPage;
