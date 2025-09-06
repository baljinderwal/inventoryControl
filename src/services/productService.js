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
    const response = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...productData, createdAt: new Date().toISOString() }),
    });
    if (!response.ok) {
      throw new Error('Failed to add product');
    }
    return await response.json();
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
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    };
    const response = await api.get('/products', config);
    return response.data;
  },
  getProduct: async (id) => {
    console.log(`Fetching product ${id} from API`);
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  addProduct: async (productData) => {
    console.log('Adding product via API', productData);
    const response = await api.post('/products', productData);
    return response.data;
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
