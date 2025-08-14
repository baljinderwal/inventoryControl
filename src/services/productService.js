import api from './api';

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  // Separate product details from stock details
  const { stock, batchNumber, expiryDate, ...productDetails } = productData;

  // 1. Create the product
  const productResponse = await api.post('/products', productDetails);
  const newProduct = productResponse.data;

  // 2. If initial stock is provided, create the stock entry
  if (stock > 0) {
    const newStockEntry = {
      productId: newProduct.id,
      quantity: stock,
      warehouse: 'A', // Default warehouse
      batches: [{
        batchNumber: batchNumber || `B${newProduct.id}-INIT`, // Default batch number
        expiryDate: expiryDate,
        quantity: stock
      }]
    };
    await api.post('/stock', newStockEntry);
  }

  return newProduct;
};

export const updateProduct = async (id, product) => {
  // Using PATCH is better for partial updates
  const response = await api.patch(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
