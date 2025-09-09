import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import BillingDashboard from './BillingDashboard';
import InvoiceTableView from './InvoiceTableView';
import { customerService } from '../../services/customerService';
import invoiceService from '../../services/invoiceService';


const BillingPage = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'table'

  const { data: customers = [], isLoading: isLoadingCustomers, isError: isErrorCustomers, error: errorCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers(),
  });

  const { data: invoices = [], isLoading: isLoadingInvoices, isError: isErrorInvoices, error: errorInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoiceService.getInvoices(),
  });

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const isLoading = isLoadingCustomers || isLoadingInvoices;
  const isError = isErrorCustomers || isErrorInvoices;
  const error = errorCustomers || errorInvoices;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Billing & Invoices
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="view-select-label">View</InputLabel>
          <Select
            labelId="view-select-label"
            id="view-select"
            value={view}
            label="View"
            onChange={handleViewChange}
          >
            <MenuItem value="dashboard">Dashboard</MenuItem>
            <MenuItem value="table">Table</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Alert severity="error">Error fetching data: {error?.message}</Alert>
      ) : view === 'dashboard' ? (
        <BillingDashboard invoices={invoices} />
      ) : (
        <InvoiceTableView invoices={invoices} customers={customers} />
      )}
    </Box>
  );
};

export default BillingPage;
