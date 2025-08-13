import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPOs, updatePO, deletePO } from '../../services/poService';
import { getProducts, updateProduct } from '../../services/productService';
import { getSuppliers } from '../../services/supplierService';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';
import MuiTable from '../../components/ui/Table';
import { Box, Typography, Button, CircularProgress, Chip, IconButton, Stack } from '@mui/material';
import { Add, CheckCircle, Delete, Edit, Download, PictureAsPdf } from '@mui/icons-material';
import { generatePOPDF } from '../../utils/generatePOPDF';
import AddEditPOForm from './AddEditPOForm';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const PurchaseOrdersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [poToDelete, setPOToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const { data: purchaseOrders, isLoading, isError, error } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: getPOs,
  });

  const { data: productsData, isSuccess: productsLoaded } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: suppliersData, isSuccess: suppliersLoaded } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const handleGeneratePDF = (po) => {
    if (productsLoaded && suppliersLoaded) {
      generatePOPDF(po, productsData, suppliersData);
    } else {
      showNotification('Data is not ready yet, please try again in a moment.', 'info');
    }
  };

  const receivePOMutation = useMutation({
    mutationFn: async (po) => {
      // 1. Update stock for each product in the order
      const stockUpdatePromises = po.products.map(item => {
        const product = productsData.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product with ID ${item.productId} not found`);

        const newStock = product.stock + item.quantity;
        return updateProduct(item.productId, { stock: newStock });
      });
      await Promise.all(stockUpdatePromises);

      // 2. Update the order status and completion date
      return updatePO(po.id, { status: 'Completed', completedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showNotification('Purchase Order received and stock updated successfully!', 'success');
    },
    onError: (err) => {
      showNotification(`Error receiving Purchase Order: ${err.message}`, 'error');
    }
  });

  const deletePOMutation = useMutation({
    mutationFn: deletePO,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      showNotification('Purchase Order deleted successfully!', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting Purchase Order: ${err.message}`, 'error');
    },
    onSettled: () => {
      setIsConfirmOpen(false);
      setPOToDelete(null);
    }
  });

  const handleOpenForm = (po = null) => {
    setSelectedPO(po);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPO(null);
    setIsFormOpen(false);
  };

  const handleDeleteClick = (po) => {
    setPOToDelete(po);
    setIsConfirmOpen(true);
  };

  const handleExport = () => {
    if (!purchaseOrders || !productsLoaded) return;

    const exportData = purchaseOrders.map(po => {
      const totalValue = po.products.reduce((acc, item) => {
        const product = productsData.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
      }, 0);
      const productDetails = po.products.map(p => {
        const product = productsData.find(prod => prod.id === p.productId);
        return `${product?.name || 'N/A'} (Qty: ${p.quantity})`;
      }).join(', ');

      return {
        id: po.id,
        supplier: po.supplier?.name || 'N/A',
        createdAt: po.createdAt,
        completedAt: po.completedAt || 'N/A',
        status: po.status,
        itemCount: po.products?.length || 0,
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
    link.setAttribute('download', 'purchase_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableHeaders = ['PO ID', 'Supplier', 'Date', 'Total Value', 'Status', 'Items', 'Actions'];

  const tableData = purchaseOrders?.map(po => {
    const totalValue = productsLoaded ? po.products.reduce((acc, item) => {
      const product = productsData.find(p => p.id === item.productId);
      return acc + (product?.price || 0) * item.quantity;
    }, 0) : 0;

    return {
      id: po.id,
      supplier: po.supplier?.name || 'N/A',
      date: new Date(po.createdAt).toLocaleDateString(),
      totalValue: `$${totalValue.toFixed(2)}`,
      status: (
        <Chip
          label={po.status}
          color={po.status === 'Completed' ? 'success' : 'warning'}
          size="small"
        />
      ),
      itemCount: po.products?.length || 0,
      actions: (
        <Stack direction="row" spacing={1}>
          {po.status === 'Pending' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              disabled={receivePOMutation.isLoading}
              onClick={() => receivePOMutation.mutate(po)}
            >
              Receive
            </Button>
          )}
          <IconButton size="small" onClick={() => handleOpenForm(po)} disabled={po.status === 'Completed'}>
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteClick(po)} color="error">
            <Delete fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={() => handleGeneratePDF(po)} color="primary">
            <PictureAsPdf fontSize="inherit" />
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
            disabled={!purchaseOrders || purchaseOrders.length === 0}
          >
            Export as CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
          >
            New PO
          </Button>
        </Stack>
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Error fetching purchase orders: {error.message}</Typography>}

      {!isLoading && !isError && <MuiTable headers={tableHeaders} data={tableData} />}

      {isFormOpen && (
        <AddEditPOForm
          open={isFormOpen}
          onClose={handleCloseForm}
          po={selectedPO}
        />
      )}

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deletePOMutation.mutate(poToDelete.id)}
        title="Delete Purchase Order"
        description={`Are you sure you want to delete Purchase Order #${poToDelete?.id}? This action cannot be undone.`}
        isLoading={deletePOMutation.isLoading}
      />
    </Box>
  );
};

export default PurchaseOrdersPage;
