import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';
import { poService } from '../../services/poService';
import { stockService } from '../../services/stockService';
import { supplierService } from '../../services/supplierService';
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
    queryFn: poService.getPOs,
  });

  // Note: We are using getStockLevels to get product data with stock info
  const { data: productsData, isSuccess: productsLoaded } = useQuery({
    queryKey: ['stock'],
    queryFn: stockService.getStockLevels,
  });

  const { data: suppliersData, isSuccess: suppliersLoaded } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
  });

  const handleGeneratePDF = (po) => {
    if (productsLoaded && suppliersLoaded) {
      generatePOPDF(po, productsData, suppliersData);
    } else {
      showNotification('Data is not ready yet, please try again in a moment.', 'info');
    }
  };

  // IMPORTANT: The logic for receiving a PO is now more complex with batch tracking.
  // This mutation would need to be updated to handle batch numbers and expiry dates
  // for each item received, likely via a new form/modal.
  // For now, this is a placeholder and will not correctly update stock in API mode.
  const receivePOMutation = useMutation({
    mutationFn: async (po) => {
      // In API mode, this is a placeholder. A real implementation would need a modal
      // to capture batch/expiry info for each product line.
      console.error('API for receiving PO and adjusting stock with batches is not implemented.');
      showNotification('Receiving PO is not fully implemented for batch tracking.', 'warning');
      // Just updating the status for now as a visual cue.
      return poService.updatePO(po.id, { status: 'Completed', completedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      showNotification('Purchase Order marked as received. Note: Stock not adjusted.', 'info');
    },
    onError: (err) => {
      showNotification(`Error receiving Purchase Order: ${err.message}`, 'error');
    }
  });

  const deletePOMutation = useMutation({
    mutationFn: poService.deletePO,
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
      return { id: po.id, supplier: po.supplier?.name, createdAt: po.createdAt, completedAt: po.completedAt, status: po.status, itemCount: po.products.length, totalValue: totalValue.toFixed(2), products: productDetails };
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

  const tableHeaders = [
    { id: 'id', label: 'PO ID' },
    { id: 'supplier', label: 'Supplier' },
    { id: 'date', label: 'Date' },
    { id: 'totalValue', label: 'Total Value' },
    { id: 'status', label: 'Status' },
    { id: 'itemCount', label: 'Items' },
    { id: 'actions', label: 'Actions' },
  ];

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
      status: <Chip label={po.status} color={po.status === 'Completed' ? 'success' : 'warning'} size="small" />,
      itemCount: po.products.length,
      actions: (
        <Stack direction="row" spacing={1}>
          {po.status === 'Pending' && (
            <Button variant="contained" color="success" size="small" startIcon={<CheckCircle />} disabled={receivePOMutation.isLoading} onClick={() => receivePOMutation.mutate(po)}>
              Receive
            </Button>
          )}
          <IconButton size="small" onClick={() => handleOpenForm(po)} disabled={po.status === 'Completed'}><Edit fontSize="inherit" /></IconButton>
          <IconButton size="small" onClick={() => handleDeleteClick(po)} color="error"><Delete fontSize="inherit" /></IconButton>
          <IconButton size="small" onClick={() => handleGeneratePDF(po)} color="primary"><PictureAsPdf fontSize="inherit" /></IconButton>
        </Stack>
      )
    };
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Purchase Orders</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Download />} onClick={handleExport} disabled={!purchaseOrders || purchaseOrders.length === 0}>
            Export as CSV
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
            New PO
          </Button>
        </Stack>
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Error fetching purchase orders: {error.message}</Typography>}
      {!isLoading && !isError && <MuiTable headers={tableHeaders} data={tableData || []} />}
      {isFormOpen && <AddEditPOForm open={isFormOpen} onClose={handleCloseForm} po={selectedPO} />}
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
