import api from './api';

export const getSuppliers = async () => {
  // const response = await api.get('/suppliers');
  // return response.data;

  // For the sake of this example, we will fetch products from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.suppliers || [];
};

export const addSupplier = async (supplier) => {
  const response = await api.post('/suppliers', supplier);
  return response.data;
};

export const updateSupplier = async (id, supplier) => {
  const response = await api.put(`/suppliers/${id}`, supplier);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};
