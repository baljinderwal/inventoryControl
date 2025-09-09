import api from './api';

const apiService = {
  getSalesOrders: async () => {
    const { data } = await api.get('/salesOrders');
    return data;
  },
  addSalesOrder: async (order) => {
    const { data } = await api.post('/salesOrders', order);
    return data;
  },
  updateSalesOrder: async (id, order) => {
    const { data } = await api.put(`/salesOrders/${id}`, order);
    return data;
  },
  deleteSalesOrder: async (id) => {
    await api.delete(`/salesOrders/${id}`);
    return { id };
  },
};

export const salesOrderService = apiService;
