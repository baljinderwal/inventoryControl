import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPurchaseOrder,
  addPurchaseOrder,
  updatePurchaseOrder,
} from '../../services/purchaseOrderService';
import { getSuppliers } from '../../services/supplierService';
import { getProducts } from '../../services/productService';
import { updateStock } from '../../services/stockService';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchaseOrder, setPurchaseOrder] = useState({
    supplierId: '',
    products: [{ productId: '', quantity: '' }],
    status: 'Pending',
  });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSuppliersAndProducts = async () => {
      const supplierData = await getSuppliers();
      const productData = await getProducts();
      setSuppliers(supplierData);
      setProducts(productData);
    };

    fetchSuppliersAndProducts();

    if (id) {
      const fetchPurchaseOrder = async () => {
        const order = await getPurchaseOrder(id);
        setPurchaseOrder(order);
      };
      fetchPurchaseOrder();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...purchaseOrder.products];
    newProducts[index][name] = value;
    setPurchaseOrder((prev) => ({ ...prev, products: newProducts }));
  };

  const addProduct = () => {
    setPurchaseOrder((prev) => ({
      ...prev,
      products: [...prev.products, { productId: '', quantity: '' }],
    }));
  };

  const removeProduct = (index) => {
    const newProducts = [...purchaseOrder.products];
    newProducts.splice(index, 1);
    setPurchaseOrder((prev) => ({ ...prev, products: newProducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const originalStatus = id ? (await getPurchaseOrder(id)).status : null;

    const data = {
      ...purchaseOrder,
      createdAt: id ? purchaseOrder.createdAt : new Date().toISOString(),
    };

    if (id) {
      await updatePurchaseOrder(id, data);
    } else {
      await addPurchaseOrder(data);
    }

    if (data.status === 'Received' && originalStatus !== 'Received') {
      for (const item of data.products) {
        await updateStock(item.productId, {
          quantityChange: parseInt(item.quantity, 10),
        });
      }
    }

    navigate('/purchase-orders');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Purchase Order' : 'Create Purchase Order'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                name="supplierId"
                value={purchaseOrder.supplierId}
                onChange={handleChange}
                required
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Products</Typography>
            {purchaseOrder.products.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel>Product</InputLabel>
                    <Select
                      name="productId"
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e)}
                      required
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => removeProduct(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={addProduct} sx={{ mt: 1 }}>
              Add Product
            </Button>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={purchaseOrder.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {id ? 'Update' : 'Create'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PurchaseOrderForm;
