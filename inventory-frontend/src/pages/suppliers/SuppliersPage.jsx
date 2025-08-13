import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliers, deleteSupplier } from '../../services/supplierService';
import { useNotification } from '../../utils/NotificationContext';

import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditSupplierForm from './AddEditSupplierForm';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const { data: suppliers = [], isLoading, isError, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      showNotification('Supplier deleted successfully', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting supplier: ${err.message}`, 'error');
    },
  });

  const handleAddClick = () => {
    setSupplierToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (supplier) => {
    setSupplierToEdit(supplier);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      deleteMutation.mutate(supplierToDelete.id);
    }
    setIsConfirmOpen(false);
    setSupplierToDelete(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSupplierToEdit(null);
  }

  const tableHeaders = ['Name', 'Contact Person', 'Email', 'Actions'];

  const tableData = suppliers?.map(s => ({
    name: s.name,
    contact: s.contact,
    email: s.email,
    actions: (
      <Box>
        <IconButton component={Link} to={`/suppliers/${s.id}`}><VisibilityIcon /></IconButton>
        <IconButton onClick={() => handleEditClick(s)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleDeleteClick(s)}><DeleteIcon /></IconButton>
      </Box>
    )
  }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching suppliers: {error.message}</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Suppliers</Typography>
        <Button variant="contained" onClick={handleAddClick}>Add Supplier</Button>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData || []} />

      <AppDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <AddEditSupplierForm onClose={handleCloseForm} supplier={supplierToEdit} />
      </AppDialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${supplierToDelete?.name}?`}
      />
    </div>
  );
};

export default SuppliersPage;
