import api from './api';
import * as data from '/db.json';

const local = {
  getSalesOrders: async () => {
    console.log("Fetching local sales orders");
    return data.salesOrders || [];
  },
  addSalesOrder: async (order) => {
    console.log("Adding local sales order", order);
    // This is a mock
    return { ...order, id: new Date().getTime() };
  },
  updateSalesOrder: async (id, order) => {
    console.log("Updating local sales order", id, order);
    return { ...order, id };
  },
  deleteSalesOrder: async (id) => {
    console.log("Deleting local sales order", id);
    return { id };
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
