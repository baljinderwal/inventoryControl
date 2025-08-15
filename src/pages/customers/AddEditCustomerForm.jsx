import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const AddEditCustomerForm = ({ onClose, customer }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { services } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const isEditMode = Boolean(customer);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      });
    }
  }, [customer]);

  const mutation = useMutation({
    mutationFn: isEditMode
      ? (updatedCustomer) => services.customers.updateCustomer(customer.id, updatedCustomer)
      : services.customers.addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      showNotification(`Customer ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
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
      <TextField margin="dense" id="name" name="name" label="Full Name" type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required />
      <TextField margin="dense" id="email" name="email" label="Email Address" type="email" fullWidth variant="standard" value={formData.email} onChange={handleChange} required />
      <TextField margin="dense" id="phone" name="phone" label="Phone Number" type="text" fullWidth variant="standard" value={formData.phone} onChange={handleChange} />
      <TextField margin="dense" id="address" name="address" label="Address" type="text" fullWidth variant="standard" value={formData.address} onChange={handleChange} />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isLoading}>
          {mutation.isLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Customer' : 'Add Customer')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddEditCustomerForm;
