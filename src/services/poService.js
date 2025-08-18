import api from './api';

const local = {
  getPOs: async () => {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.orders || [];
  },
  getPO: async (id) => {
    const response = await fetch('/db.json');
    const data = await response.json();
    const order = (data.orders || []).find(o => o.id === id);
    return order || null;
  },
  addPO: async (poData) => {
    console.warn('Read-only mode: addPO disabled.', poData);
    return Promise.resolve(poData);
  },
  updatePO: async (poId, poData) => {
    console.warn('Read-only mode: updatePO disabled.', poId, poData);
    return Promise.resolve(poData);
  },
  deletePO: async (id) => {
    console.warn('Read-only mode: deletePO disabled.', id);
    return Promise.resolve();
  },
};

const remote = {
  getPOs: async () => {
    const response = await api.get('/orders?_expand=supplier&_sort=createdAt&_order=desc');
    return response.data;
  },
  getPO: async (id) => {
    const response = await api.get(`/orders/${id}?_expand=supplier`);
    return response.data;
  },
  addPO: async (poData) => {
    const response = await api.post('/orders', poData);
    return response.data;
  },
  updatePO: async (poId, poData) => {
    const response = await api.put(`/orders/${poId}`, poData);
    return response.data;
  },
  deletePO: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export const poService = { local, api: remote };
