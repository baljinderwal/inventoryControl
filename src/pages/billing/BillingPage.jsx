import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import MuiTable from '../../components/ui/Table';
import { Box, Typography, CircularProgress, Alert, Chip, Stack, IconButton, Button } from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF';
import AppDialog from '../../components/ui/AppDialog';
import { useNotification } from '../../utils/NotificationContext';


const BillingPage = () => {
  const { mode, services } = useApi();
  const { showNotification } = useNotification();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [invoiceToView, setInvoiceToView] = useState(null);

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', mode],
    queryFn: () => services.customers.getCustomers(),
  });

  // Define a getter for invoices in invoiceService.js first
  // For now, let's assume it exists and is named getInvoices
  const { data: invoices = [], isLoading, isError, error } = useQuery({
    queryKey: ['invoices', mode],
    queryFn: () => services.invoices.getInvoices(), // This function needs to be created
  });

  const tableHeaders = [
    { id: 'id', label: 'Invoice ID' },
    { id: 'customerName', label: 'Customer' },
    { id: 'invoiceDate', label: 'Invoice Date' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'status', label: 'Status' },
    { id: 'total', label: 'Total' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = invoices.map((invoice) => ({
    id: invoice.id,
    customerName: invoice.customerName,
    invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),
    dueDate: new Date(invoice.dueDate).toLocaleDateString(),
    status: <Chip label={invoice.status} color={invoice.status === 'Paid' ? 'success' : (invoice.status === 'Draft' ? 'default' : 'warning')} size="small" />,
    total: `$${invoice.total.toFixed(2)}`,
    actions: (
      <Stack direction="row" spacing={1}>
        <IconButton onClick={() => handleViewDetails(invoice)} size="small"><Visibility /></IconButton>
        <IconButton onClick={() => console.log('Edit', invoice.id)} size="small"><Edit /></IconButton>
        <IconButton onClick={() => console.log('Delete', invoice.id)} size="small"><Delete /></IconButton>
      </Stack>
    ),
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching invoices: {error.message}</Alert>;
  }

  const handleViewDetails = (invoice) => {
    setInvoiceToView(invoice);
    setIsDetailsOpen(true);
  };

  const handleDownloadPDF = () => {
    if (!invoiceToView || !customers.length) {
      showNotification('Customer data not loaded yet.', 'warning');
      return;
    }
    const customer = customers.find(c => c.id === invoiceToView.customerId);
    if (customer) {
      generateInvoicePDF(invoiceToView, customer);
    } else {
      showNotification('Could not find customer details for this invoice.', 'error');
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing & Invoices
      </Typography>
      <MuiTable headers={tableHeaders} data={tableData} />

      <AppDialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Details for Invoice #${invoiceToView?.id}`}
        fullWidth
        maxWidth="md"
      >
        {invoiceToView && (
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">Customer: {invoiceToView.customerName}</Typography>
                <Typography>Date: {new Date(invoiceToView.invoiceDate).toLocaleString()}</Typography>
                <Typography>Due: {new Date(invoiceToView.dueDate).toLocaleString()}</Typography>
                <Typography>Status: {invoiceToView.status}</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleDownloadPDF}
                disabled={!customers.length}
              >
                Download PDF
              </Button>
            </Stack>
            <Typography variant="h6" sx={{ mt: 2 }}>Items:</Typography>
            <ul>
              {invoiceToView.items.map(item => (
                <li key={item.productId}>{item.productName} - Qty: {item.quantity} @ ${item.price.toFixed(2)}</li>
              ))}
            </ul>
            <Typography variant="h5" sx={{ mt: 2 }} align="right">Total: ${invoiceToView.total.toFixed(2)}</Typography>
          </Box>
        )}
      </AppDialog>
    </Box>
  );
};

export default BillingPage;
