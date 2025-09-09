import api from './api';

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

export const productService = remote;
