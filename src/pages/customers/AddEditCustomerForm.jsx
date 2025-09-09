import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { customerService } from '../../services/customerService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const AddEditCustomerForm = ({ onClose, customer }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

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
      ? (updatedCustomer) => customerService.updateCustomer(customer.id, updatedCustomer)
      : customerService.addCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      showNotification(`Customer ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
      onClose(isEditMode ? null : data); // Pass back the new customer data on creation
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
      <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Customer Information
      </Typography>
      
      <TextField margin="normal" id="name" name="name" label="Full Name" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleChange} required />
      <TextField margin="normal" id="email" name="email" label="Email Address" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} required />
      <TextField margin="normal" id="phone" name="phone" label="Phone Number" type="text" fullWidth variant="outlined" value={formData.phone} onChange={handleChange} />
      <TextField margin="normal" id="address" name="address" label="Address" type="text" fullWidth variant="outlined" value={formData.address} onChange={handleChange} />
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
