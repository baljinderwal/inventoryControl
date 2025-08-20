import api from './api';

const local = {
  getSuppliers: async () => {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.suppliers || [];
  },
  getSupplier: async (id) => {
    console.log(`Fetching supplier ${id} from local db.json`);
    const res = await fetch(`/suppliers/${id}`);
    if (!res.ok) {
      throw new Error(`Could not fetch supplier ${id}`);
    }
    return await res.json();
  },
  addSupplier: async (supplier) => {
    console.warn('Read-only mode: addSupplier disabled.', supplier);
    return Promise.resolve(supplier);
  },
  updateSupplier: async (id, supplier) => {
    console.warn('Read-only mode: updateSupplier disabled.', id, supplier);
    return Promise.resolve(supplier);
  },
  deleteSupplier: async (id) => {
    console.warn('Read-only mode: deleteSupplier disabled.', id);
    return Promise.resolve();
  },
};

const remote = {
  getSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  getSupplier: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
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

export const supplierService = { local, api: remote };
