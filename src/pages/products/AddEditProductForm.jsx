import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct, updateProduct } from '../../services/productService';
import { useNotification } from '../../utils/NotificationContext';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const AddEditProductForm = ({ onClose, product }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: '',
  });

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        stock: product.stock || '',
        lowStockThreshold: product.lowStockThreshold || '',
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: isEditMode
      ? (updatedProduct) => updateProduct(product.id, updatedProduct)
      : addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showNotification(`Product ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
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
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
      stock: parseInt(formData.stock, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10),
    };
    mutation.mutate(submissionData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="dense" id="name" name="name" label="Product Name" type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required />
      <TextField margin="dense" id="sku" name="sku" label="SKU" type="text" fullWidth variant="standard" value={formData.sku} onChange={handleChange} required />
      <TextField margin="dense" id="category" name="category" label="Category" type="text" fullWidth variant="standard" value={formData.category} onChange={handleChange} required />
      <TextField margin="dense" id="price" name="price" label="Price" type="number" fullWidth variant="standard" value={formData.price} onChange={handleChange} required />
      <TextField margin="dense" id="costPrice" name="costPrice" label="Cost Price" type="number" fullWidth variant="standard" value={formData.costPrice} onChange={handleChange} required />
      <TextField margin="dense" id="stock" name="stock" label="Stock" type="number" fullWidth variant="standard" value={formData.stock} onChange={handleChange} required />
      <TextField margin="dense" id="lowStockThreshold" name="lowStockThreshold" label="Low Stock Threshold" type="number" fullWidth variant="standard" value={formData.lowStockThreshold} onChange={handleChange} required />

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? <CircularProgress size={24} /> : (isEditMode ? 'Update Product' : 'Add Product')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddEditProductForm;
