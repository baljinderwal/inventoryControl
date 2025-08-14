// import api from './api';

export const getProducts = async () => {
  // const response = await api.get('/products');
  // return response.data;

  // For the sake of this example, we will fetch products from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.products || [];
};

export const getProduct = async (id) => {
  // const response = await api.get(`/products/${id}`);
  // return response.data;

  const response = await fetch('/db.json');
  const data = await response.json();
  const products = data.products || [];
  return products.find(p => p.id === id);
};

export const addProduct = async (productData) => {
  // This is a read-only operation.
  console.log('Read-only mode: addProduct disabled.', productData);
  return Promise.resolve(productData);
};

export const updateProduct = async (id, product) => {
  // This is a read-only operation.
  console.log('Read-only mode: updateProduct disabled.', id, product);
  return Promise.resolve(product);
};

export const deleteProduct = async (id) => {
  // This is a read-only operation.
  console.log('Read-only mode: deleteProduct disabled.', id);
  return Promise.resolve();
};
