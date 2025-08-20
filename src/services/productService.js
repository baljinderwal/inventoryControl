import api from './api';
import { supplierService } from './supplierService';

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
    const { stock, batchNumber, expiryDate, supplierId, ...productDetails } = productData;

    // 1. Create the product
    const productResponse = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...productDetails, createdAt: new Date().toISOString() }),
    });
    const newProduct = await productResponse.json();

    // 2. If a supplier is associated, update the supplier's product list
    if (supplierId) {
      try {
        const supplier = await supplierService.local.getSupplier(supplierId);
        const updatedProducts = supplier.products ? [...supplier.products, newProduct.id] : [newProduct.id];
        await supplierService.local.updateSupplier(supplierId, { ...supplier, products: updatedProducts });
      } catch (error) {
        // Log the error but don't block the product creation from completing
        console.error(`Failed to associate product with supplier ${supplierId}:`, error);
      }
    }

    // 3. If initial stock is provided, create the stock entry
    if (stock > 0) {
      const newStockEntry = {
        productId: newProduct.id,
        quantity: stock,
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
    // Separate product details from stock and supplier details
    const { stock, batchNumber, expiryDate, supplierId, ...productDetails } = productData;

    // 1. Create the product
    const productResponse = await api.post('/products', productDetails);
    const newProduct = productResponse.data;

    // 2. If a supplier is associated, update the supplier's product list
    if (supplierId) {
      try {
        const supplier = await supplierService.api.getSupplier(supplierId);
        const updatedProducts = supplier.products ? [...supplier.products, newProduct.id] : [newProduct.id];
        await supplierService.api.updateSupplier(supplierId, { ...supplier, products: updatedProducts });
      } catch (error) {
        console.error(`Failed to associate product with supplier ${supplierId}:`, error);
        // Depending on requirements, you might want to notify the user here
      }
    }

    // 3. If initial stock is provided, create the stock entry
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
