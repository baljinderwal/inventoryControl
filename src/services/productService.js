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
    console.log('Adding product in local mode (no persistence)', productData);
    // In local/demo mode, we simulate adding by creating a temporary ID.
    const newProduct = {
      ...productData,
      id: `temp-${Date.now()}`, // Create a temporary unique ID
      createdAt: new Date().toISOString(),
    };
    return Promise.resolve(newProduct);
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
    const { stock, batchNumber, expiryDate, locationId, ...productDetails } = productData;

    // 1. Create the product
    const productResponse = await api.post('/products', productDetails);
    const newProduct = productResponse.data;

    // 2. If it's a simple product and initial stock is provided, create the stock entry
    if (productDetails.type === 'simple' && stock > 0 && expiryDate && locationId) {
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
    // No stock entry for bundle products

    return newProduct;
  },
  updateProduct: async (id, product) => {
    console.log(`Updating product ${id} via API`, product);
    // If the product is a bundle, ensure bundleItems is part of the update
    // The current logic should handle this correctly as `product` contains all fields
    const response = await api.patch(`/products/${id}`, product);
    return response.data;
  },
  deleteProduct: async (id) => {
    console.log(`Deleting product ${id} via API`);
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const productService = { local, api: remote };
