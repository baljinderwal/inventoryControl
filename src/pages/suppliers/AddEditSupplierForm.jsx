import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSupplier, updateSupplier } from '../../services/supplierService';
import { useNotification } from '../../utils/NotificationContext';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const AddEditSupplierForm = ({ onClose, supplier }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
  });

  const isEditMode = Boolean(supplier);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact: supplier.contact || '',
        email: supplier.email || '',
      });
    }
  }, [supplier]);

  const mutation = useMutation({
    mutationFn: isEditMode
      ? (updatedSupplier) => updateSupplier(supplier.id, updatedSupplier)
      : addSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      showNotification(`Supplier ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error: ${err.message}`, 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="dense" id="name" name="name" label="Supplier Name" type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required />
      <TextField margin="dense" id="contact" name="contact" label="Contact Person" type="text" fullWidth variant="standard" value={formData.contact} onChange={handleChange} required />
      <TextField margin="dense" id="email" name="email" label="Email" type="email" fullWidth variant="standard" value={formData.email} onChange={handleChange} required />

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : (isEditMode ? 'Update Supplier' : 'Add Supplier')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddEditSupplierForm;
