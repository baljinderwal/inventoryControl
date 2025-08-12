import api from './api';

export const getOrders = async () => {
  // Use _expand to automatically embed the supplier details in each order
  // Also sort by creation date descending to show newest first
  const response = await api.get('/orders?_expand=supplier&_sort=createdAt&_order=desc');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}?_expand=supplier`);
  return response.data;
};

export const addOrder = async (order) => {
  const response = await api.post('/orders', order);
  return response.data;
};

export const updateOrder = async (orderId, orderData) => {
  const response = await api.patch(`/orders/${orderId}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
