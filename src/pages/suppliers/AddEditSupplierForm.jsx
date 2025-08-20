import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

const AddEditSupplierForm = ({ onClose, supplier }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { services } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
  });
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: services.products.getProducts,
  });

  const isEditMode = Boolean(supplier);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact: supplier.contact || '',
        email: supplier.email || '',
      });
      setSelectedProductIds(supplier.products || []);
    }
  }, [supplier]);

  const mutation = useMutation({
    mutationFn: isEditMode
      ? (updatedSupplier) => services.suppliers.updateSupplier(supplier.id, updatedSupplier)
      : services.suppliers.addSupplier,
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

  const handleProductChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProductIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleDeleteProduct = (productIdToDelete) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productIdToDelete));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData, products: selectedProductIds };
    if (isEditMode) {
      mutation.mutate({ ...supplier, ...submissionData });
    } else {
      mutation.mutate(submissionData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="dense" id="name" name="name" label="Supplier Name" type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required />
      <TextField margin="dense" id="contact" name="contact" label="Contact Person" type="text" fullWidth variant="standard" value={formData.contact} onChange={handleChange} required />
      <TextField margin="dense" id="email" name="email" label="Email" type="email" fullWidth variant="standard" value={formData.email} onChange={handleChange} required />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Products</Typography>
        {isLoadingProducts ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth>
            <InputLabel id="multiple-product-label">Products</InputLabel>
            <Select
              labelId="multiple-product-label"
              id="multiple-product"
              multiple
              value={selectedProductIds}
              onChange={handleProductChange}
              input={<OutlinedInput label="Products" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const product = productsData?.find(p => p.id === id);
                    return <Chip key={id} label={product?.name || id} />;
                  })}
                </Box>
              )}
            >
              {productsData?.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedProductIds.map((id) => {
             const product = productsData?.find(p => p.id === id);
             return (
              <Chip
                key={id}
                label={product?.name || id}
                onDelete={() => handleDeleteProduct(id)}
                sx={{ mr: 1, mb: 1 }}
              />
             )
          })}
        </Box>
      </Box>

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
