import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';

import MuiTable from '../../components/ui/Table';
import AppDialog from '../../components/ui/AppDialog';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import AddEditSupplierForm from './AddEditSupplierForm';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';

const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { mode, services } = useApi();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const { data: suppliers = [], isLoading, isError, error } = useQuery({
    queryKey: ['suppliers', mode],
    queryFn: services.suppliers.getSuppliers,
  });

  const deleteMutation = useMutation({
    mutationFn: services.suppliers.deleteSupplier,
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

  const handleExport = () => {
    if (!suppliers) return;
    const fields = ['id', 'name', 'contact', 'email'];
    const parser = new Parser({ fields });
    const csv = parser.parse(suppliers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'suppliers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableHeaders = [
    { id: 'name', label: 'Name' },
    { id: 'contact', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = suppliers?.map(s => ({
    id: s.id,
    name: s.name,
    contact: s.contact,
    email: s.email,
    actions: (
      <Box>
        <IconButton onClick={() => handleEditClick(s)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleDeleteClick(s)}><DeleteIcon /></IconButton>
      </Box>
    )
  }));

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching suppliers: {error.message}</Alert>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Suppliers</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!suppliers || suppliers.length === 0}
          >
            Export as CSV
          </Button>
          <Button variant="contained" onClick={handleAddClick}>Add Supplier</Button>
        </Stack>
      </Box>

      <MuiTable headers={tableHeaders} data={tableData || []} />

      <AppDialog
        open={isFormOpen}
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
