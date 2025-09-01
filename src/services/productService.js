import api from './api';

const local = {
  getProducts: async () => {
    console.log('Fetching products from local API endpoint');
    const response = await fetch('/products');
    if (!response.ok) {
      throw new Error('Failed to fetch local products');
    }
    return await response.json();
  },
  getProduct: async (id) => {
    console.log(`Fetching product ${id} from local API endpoint`);
    const response = await fetch(`/products/${id}`);
    if (!response.ok) {
      return null; // Or throw an error, depending on desired behavior for not found
    }
    return await response.json();
  },
  addProduct: async (productData) => {
    console.log('Adding product in local mode', productData);
    const { stock, batchNumber, expiryDate, sizes, colorOptions, ...productDetails } = productData;

    // Create product
    const productResponse = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...productDetails, createdAt: new Date().toISOString(), sizes, colorOptions }),
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

    // Add to timeseries for each size and color variation
    if (sizes && sizes.length > 0 && colorOptions && colorOptions.length > 0) {
      for (const size of sizes) {
        for (const colorOption of colorOptions) {
          try {
            await fetch('https://inventorybackend-loop.onrender.com/timeseries/shoes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                shoe_name: newProduct.name,
                size: parseInt(size.size, 10),
                color: colorOption.colors.join(', '),
                quantity: colorOption.quantity,
                timestamp: new Date().toISOString()
              }),
            });
          } catch (e) {
            console.error('Failed to post timeseries data for size and color', size, colorOption, e);
          }
        }
      }
    }

    return newProduct;
  },
  updateProduct: async (id, product) => {
    console.log(`Updating product ${id} in local mode`, product);
    const { stock, ...productDetails } = product;
    const response = await fetch(`/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productDetails),
    });
    return await response.json();
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
    const { stock, batchNumber, expiryDate, sizes, colorOptions, ...productDetails } = productData;

    // Create product
    const productResponse = await api.post('/products', { ...productDetails, sizes, colorOptions });
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

    // Add to timeseries for each size and color variation
    if (sizes && sizes.length > 0 && colorOptions && colorOptions.length > 0) {
      for (const size of sizes) {
        for (const colorOption of colorOptions) {
          try {
            await fetch('https://inventorybackend-loop.onrender.com/timeseries/shoes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                shoe_name: newProduct.name,
                size: parseInt(size.size, 10),
                color: colorOption.colors.join(', '),
                quantity: colorOption.quantity,
                timestamp: new Date().toISOString()
              }),
            });
          } catch (e) {
            console.error('Failed to post timeseries data for size and color', size, colorOption, e);
          }
        }
      }
    }

    return newProduct;
  },
  updateProduct: async (id, product) => {
    console.log(`Updating product ${id} via API`, product);
    const { stock, ...productDetails } = product;
    const response = await api.put(`/products/${id}`, productDetails);
    return response.data;
  },
  deleteProduct: async (id) => {
    console.log(`Deleting product ${id} via API`);
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const productService = { local, api: remote };
