import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';

const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Product Data:', formData);
    onClose(); // Close the modal after submission
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        name="name"
        label="Product Name"
        type="text"
        fullWidth
        variant="standard"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        margin="dense"
        id="sku"
        name="sku"
        label="SKU"
        type="text"
        fullWidth
        variant="standard"
        value={formData.sku}
        onChange={handleChange}
        required
      />
      <TextField
        margin="dense"
        id="price"
        name="price"
        label="Price"
        type="number"
        fullWidth
        variant="standard"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <TextField
        margin="dense"
        id="stock"
        name="stock"
        label="Stock"
        type="number"
        fullWidth
        variant="standard"
        value={formData.stock}
        onChange={handleChange}
        required
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">Add Product</Button>
      </DialogActions>
    </Box>
  );
};

export default AddProductForm;
