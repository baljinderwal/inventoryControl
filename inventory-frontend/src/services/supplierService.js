import api from './api';

export const getSuppliers = async () => {
  const response = await api.get('/suppliers');
  return response.data;
};

export const getSupplier = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
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
