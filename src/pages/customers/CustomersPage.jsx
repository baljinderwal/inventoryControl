import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { customerService } from '../../services/customerService';
import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditCustomerForm from './AddEditCustomerForm';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const CustomersPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const { data: customers = [], isLoading, isError, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getCustomers,
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      showNotification('Customer deleted successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting customer: ${err.message}`, 'error');
    },
  });

  const handleAddClick = () => {
    setCustomerToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (customer) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete.id);
    }
    setIsConfirmOpen(false);
    setCustomerToDelete(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCustomerToEdit(null);
  };

  const tableHeaders = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'address', label: 'Address' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    actions: (
      <Box>
        <IconButton 
          onClick={() => handleEditClick(customer)}
          sx={{ 
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': { 
              backgroundColor: 'primary.light',
              transform: 'scale(1.1)' 
            }
          }}
        >
          <Edit />
        </IconButton>
        <IconButton 
          onClick={() => handleDeleteClick(customer)}
          sx={{ 
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': { 
              backgroundColor: 'error.light',
              transform: 'scale(1.1)' 
            }
          }}
        >
          <Delete />
        </IconButton>
      </Box>
    ),
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching customers: {error.message}</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Customers</Typography>
        <Button variant="contained" onClick={handleAddClick}>Add Customer</Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData} />

      <AppDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        title={customerToEdit ? 'Edit Customer' : 'Add New Customer'}
      >
        <AddEditCustomerForm onClose={handleCloseForm} customer={customerToEdit} />
      </AppDialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}?`}
      />
    </div>
  );
};

export default CustomersPage;
