import api from './api';

export const getPurchaseOrders = async () => {
  const response = await api.get('/purchaseOrders');
  return response.data;
};

export const getPurchaseOrder = async (id) => {
  const response = await api.get(`/purchaseOrders/${id}`);
  return response.data;
};

export const addPurchaseOrder = async (purchaseOrder) => {
  const response = await api.post('/purchaseOrders', purchaseOrder);
  return response.data;
};

export const updatePurchaseOrder = async (id, purchaseOrder) => {
  const response = await api.put(`/purchaseOrders/${id}`, purchaseOrder);
  return response.data;
};
