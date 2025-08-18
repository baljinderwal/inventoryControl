import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditSOForm from './AddEditSOForm';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import { Edit, Delete, Visibility, Description } from '@mui/icons-material';

const SalesOrdersPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [soToEdit, setSoToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [soToDelete, setSoToDelete] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [soToView, setSoToView] = useState(null);

  const { data: salesOrders = [], isLoading, isError, error } = useQuery({
    queryKey: ['salesOrders', mode],
    queryFn: services.salesOrders.getSalesOrders,
  });

  const deleteMutation = useMutation({
    mutationFn: services.salesOrders.deleteSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      showNotification('Sales Order deleted successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting sales order: ${err.message}`, 'error');
    },
  });

  const handleAddClick = () => {
    setSoToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (so) => {
    setSoToEdit(so);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (so) => {
    setSoToDelete(so);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (soToDelete) {
      deleteMutation.mutate(soToDelete.id);
    }
    setIsConfirmOpen(false);
    setSoToDelete(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSoToEdit(null);
  };

  const handleViewDetails = (so) => {
    setSoToView(so);
    setIsDetailsOpen(true);
  };

  const generateInvoiceMutation = useMutation({
    mutationFn: services.invoices.createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      showNotification(`Invoice #${data.id} created successfully!`, 'success');
    },
    onError: (err) => {
      showNotification(`Error creating invoice: ${err.message}`, 'error');
    },
  });

  const handleGenerateInvoiceClick = (so) => {
    const newInvoice = {
      salesOrderId: so.id,
      customerId: so.customerId,
      customerName: so.customerName,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // Due in 30 days
      status: 'Draft',
      items: so.items,
      total: so.total,
    };
    generateInvoiceMutation.mutate(newInvoice);
  };

  const tableHeaders = [
    { id: 'id', label: 'SO ID' },
    { id: 'customerName', label: 'Customer' },
    { id: 'createdAt', label: 'Date' },
    { id: 'status', label: 'Status' },
    { id: 'total', label: 'Total' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = salesOrders.map((so) => ({
    id: so.id,
    customerName: so.customerName,
    createdAt: new Date(so.createdAt).toLocaleDateString(),
    status: <Chip label={so.status} color={so.status === 'Completed' ? 'success' : (so.status === 'Pending' ? 'warning' : 'default')} size="small" />,
    total: `$${so.total.toFixed(2)}`,
    actions: (
      <Stack direction="row" spacing={1}>
        <IconButton onClick={() => handleViewDetails(so)} size="small"><Visibility /></IconButton>
        {so.status === 'Completed' && (
          <IconButton onClick={() => handleGenerateInvoiceClick(so)} size="small" title="Generate Invoice">
            <Description />
          </IconButton>
        )}
        <IconButton onClick={() => handleEditClick(so)} size="small"><Edit /></IconButton>
        <IconButton onClick={() => handleDeleteClick(so)} size="small"><Delete /></IconButton>
      </Stack>
    ),
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching sales orders: {error.message}</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Sales Orders</Typography>
        <Button variant="contained" onClick={handleAddClick}>Create Sales Order</Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />

      <AddEditSOForm open={isFormOpen} onClose={handleCloseForm} so={soToEdit} />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Sales Order"
        message={`Are you sure you want to delete Sales Order #${soToDelete?.id}?`}
      />

      <AppDialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Details for SO #${soToView?.id}`}
      >
        {soToView && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Customer: {soToView.customerName}</Typography>
            <Typography>Date: {new Date(soToView.createdAt).toLocaleString()}</Typography>
            <Typography>Status: {soToView.status}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Items:</Typography>
            <ul>
              {soToView.items.map(item => (
                <li key={item.productId}>{item.productName} - Qty: {item.quantity} @ ${item.price.toFixed(2)}</li>
              ))}
            </ul>
            <Typography variant="h5" sx={{ mt: 2 }} align="right">Total: ${soToView.total.toFixed(2)}</Typography>
          </Box>
        )}
      </AppDialog>
    </div>
  );
};

export default SalesOrdersPage;
