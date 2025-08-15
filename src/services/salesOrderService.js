import api from './api';

const local = {
  getSalesOrders: async () => {
    console.log("Fetching local sales orders");
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.salesOrders || [];
  },
  addSalesOrder: async (order) => {
    console.warn("Read-only mode: addSalesOrder disabled.", order);
    return Promise.resolve({ ...order, id: new Date().getTime() });
  },
  updateSalesOrder: async (id, order) => {
    console.warn("Read-only mode: updateSalesOrder disabled.", id, order);
    return Promise.resolve({ ...order, id });
  },
  deleteSalesOrder: async (id) => {
    console.warn("Read-only mode: deleteSalesOrder disabled.", id);
    return Promise.resolve({ id });
  },
};

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

export const salesOrderService = {
  local,
  api: apiService,
};
