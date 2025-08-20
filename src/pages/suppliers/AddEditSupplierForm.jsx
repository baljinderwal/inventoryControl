import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const AddEditSupplierForm = ({ onClose, supplier }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { services } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
  });
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState('');

  const isEditMode = Boolean(supplier);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact: supplier.contact || '',
        email: supplier.email || '',
      });
      setProducts(supplier.products || []);
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

  const handleAddProduct = () => {
    if (currentProduct && !products.includes(currentProduct)) {
      setProducts([...products, currentProduct]);
      setCurrentProduct('');
    }
  };

  const handleDeleteProduct = (productToDelete) => {
    setProducts(products.filter((product) => product !== productToDelete));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData, products };
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
        <Typography variant="h6">Products</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            margin="dense"
            id="product"
            name="product"
            label="Add Product"
            type="text"
            fullWidth
            variant="standard"
            value={currentProduct}
            onChange={(e) => setCurrentProduct(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddProduct();
              }
            }}
          />
          <Button onClick={handleAddProduct} sx={{ ml: 1 }}>
            Add
          </Button>
        </Box>
        <Box>
          {products.map((product) => (
            <Chip
              key={product}
              label={product}
              onDelete={() => handleDeleteProduct(product)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
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
