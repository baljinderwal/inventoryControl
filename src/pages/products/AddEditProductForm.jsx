import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { useNotification } from '../../utils/NotificationContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const AddEditProductForm = ({
  onClose,
  product
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { services } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    costPrice: '',
    lowStockThreshold: '',
    stock: '',
    batchNumber: '',
    expiryDate: '',
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
        lowStockThreshold: product.lowStockThreshold || '',
        stock: '',
        batchNumber: '',
        expiryDate: '',
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: isEditMode ?
      (updatedProduct) => services.products.updateProduct(product.id, updatedProduct) :
      services.products.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
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
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 0,
      stock: parseInt(formData.stock, 10) || 0,
    };
    if (isEditMode) {
      delete submissionData.stock;
      delete submissionData.batchNumber;
      delete submissionData.expiryDate;
    }
    mutation.mutate(submissionData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="dense" id="name" name="name" label="Product Name" type="text" fullWidth variant="standard" value={formData.name} onChange={handleChange} required />
      <TextField margin="dense" id="sku" name="sku" label="SKU" type="text" fullWidth variant="standard" value={formData.sku} onChange={handleChange} required />
      <TextField margin="dense" id="category" name="category" label="Category" type="text" fullWidth variant="standard" value={formData.category} onChange={handleChange} required />
      <TextField margin="dense" id="price" name="price" label="Price" type="number" fullWidth variant="standard" value={formData.price} onChange={handleChange} required />
      <TextField margin="dense" id="costPrice" name="costPrice" label="Cost Price" type="number" fullWidth variant="standard" value={formData.costPrice} onChange={handleChange} required />
      <TextField margin="dense" id="lowStockThreshold" name="lowStockThreshold" label="Low Stock Threshold" type="number" fullWidth variant="standard" value={formData.lowStockThreshold} onChange={handleChange} required />

      {!isEditMode && (
        <>
          <TextField margin="dense" id="stock" name="stock" label="Initial Stock" type="number" fullWidth variant="standard" value={formData.stock} onChange={handleChange} />
          <TextField margin="dense" id="batchNumber" name="batchNumber" label="Batch Number" type="text" fullWidth variant="standard" value={formData.batchNumber} onChange={handleChange} />
          <TextField margin="dense" id="expiryDate" name="expiryDate" label="Expiry Date" type="date" fullWidth variant="standard" value={formData.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        </>
      )}

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
