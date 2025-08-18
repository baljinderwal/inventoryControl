import api from './api';

const local = {
  getProducts: async () => {
    console.log('Fetching products from local db.json');
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.products || [];
  },
  getProduct: async (id) => {
    console.log(`Fetching product ${id} from local db.json`);
    const response = await fetch('/db.json');
    const data = await response.json();
    const products = data.products || [];
    return products.find(p => p.id === id);
  },
  addProduct: async (productData) => {
    console.log('Adding product in local mode', productData);
    const { stock, batchNumber, expiryDate, locationId, ...productDetails } = productData;

    // 1. Create the product
    const productResponse = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...productDetails, createdAt: new Date().toISOString() }),
    });
    const newProduct = await productResponse.json();

    // 2. If initial stock is provided, create the stock entry
    if (stock > 0 && locationId) {
      const newStockEntry = {
        productId: newProduct.id,
        quantity: stock,
        locationId: parseInt(locationId),
        batches: [{
          batchNumber: batchNumber || `B${newProduct.id}-INIT`,
          expiryDate: expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Default 1 year expiry
          quantity: stock
        }]
      };
      await fetch('/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStockEntry)
      });
    }
    return newProduct;
  },
  updateProduct: async (id, product) => {
    console.warn('Read-only mode: updateProduct disabled.', id, product);
    return Promise.resolve(product);
  },
  deleteProduct: async (id) => {
    console.warn('Read-only mode: deleteProduct disabled.', id);
    return Promise.resolve();
  },
};

const remote = {
  getProducts: async () => {
    console.log('Fetching products from API');
    const response = await api.get('/products');
    return response.data;
  },
  getProduct: async (id) => {
    console.log(`Fetching product ${id} from API`);
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  addProduct: async (productData) => {
    console.log('Adding product via API', productData);
    // Separate product details from stock details
    const { stock, batchNumber, expiryDate, locationId, ...productDetails } = productData;

    // 1. Create the product
    const productResponse = await api.post('/products', productDetails);
    const newProduct = productResponse.data;

    // 2. If initial stock is provided, create the stock entry
    if (stock > 0 && expiryDate && locationId) { // Ensure all stock details are present
      const newStockEntry = {
        productId: newProduct.id,
        quantity: stock,
        locationId: locationId,
        batches: [{
          batchNumber: batchNumber || `B${newProduct.id}-INIT`,
          expiryDate: expiryDate,
          quantity: stock
        }]
      };
      await api.post('/stock', newStockEntry);
    }
    return newProduct;
  },
  updateProduct: async (id, product) => {
    console.log(`Updating product ${id} via API`, product);
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  deleteProduct: async (id) => {
    console.log(`Deleting product ${id} via API`);
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const productService = { local, api: remote };
