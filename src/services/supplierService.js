import api from './api';

const remote = {
  getSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  addSupplier: async (supplier) => {
    const response = await api.post('/suppliers', supplier);
    return response.data;
  },
  updateSupplier: async (id, supplier) => {
    const response = await api.put(`/suppliers/${id}`, supplier);
    return response.data;
  },
  deleteSupplier: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },
};

export const supplierService = remote;
