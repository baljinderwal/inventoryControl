import api from './api';

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

export const poService = remote;
