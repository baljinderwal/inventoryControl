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
    const { stock, batchNumber, expiryDate, sizes, color, ...productDetails } = productData;

    // Create product
    const productResponse = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...productDetails, createdAt: new Date().toISOString(), sizes, color }),
    });
    const newProduct = await productResponse.json();

    // Create stock entry
    if (stock > 0) {
      const newStockEntry = {
        productId: newProduct.id,
        quantity: stock,
        batches: [{
          batchNumber: batchNumber || `B${newProduct.id}-INIT`,
          expiryDate: expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          quantity: stock
        }]
      };
      await fetch('/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStockEntry)
      });
    }

    // Add to timeseries for each size
    if (sizes && sizes.length > 0 && color) {
      for (const size of sizes) {
        try {
          await fetch('https://inventorybackend-loop.onrender.com/timeseries/shoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shoe_name: newProduct.name,
              size: parseInt(size, 10),
              color: color,
              timestamp: new Date().toISOString()
            }),
          });
        } catch (e) {
          console.error('Failed to post timeseries data for size', size, e);
        }
      }
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
    const { stock, batchNumber, expiryDate, sizes, color, ...productDetails } = productData;

    // Create product
    const productResponse = await api.post('/products', { ...productDetails, sizes, color });
    const newProduct = productResponse.data;

    // Create stock entry
    if (stock > 0) {
      const newStockEntry = {
        productId: newProduct.id,
        quantity: stock,
        batches: [{
          batchNumber: batchNumber || `B${newProduct.id}-INIT`,
          expiryDate: expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          quantity: stock
        }]
      };
      await api.post('/stock', newStockEntry);
    }

    // Add to timeseries for each size
    if (sizes && sizes.length > 0 && color) {
      for (const size of sizes) {
        try {
          // This should be an API call to your own backend, which then calls the timeseries service
          // For now, calling it directly for demonstration
          await fetch('https://inventorybackend-loop.onrender.com/timeseries/shoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shoe_name: newProduct.name,
              size: parseInt(size, 10),
              color: color,
              timestamp: new Date().toISOString()
            }),
          });
        } catch (e) {
          console.error('Failed to post timeseries data for size', size, e);
        }
      }
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
