// import api from './api';

export const getPOs = async () => {
  // Use _expand to automatically embed the supplier details in each order
  // Also sort by creation date descending to show newest first
  // const response = await api.get('/orders?_expand=supplier&_sort=createdAt&_order=desc');
  // return response.data;

  // For the sake of this example, we will fetch orders from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.orders || [];
};

export const getPO = async (id) => {
  // const response = await api.get(`/orders/${id}?_expand=supplier`);
  // return response.data;

  // For the sake of this example, we will fetch a single order from a public db.json file
  const response = await fetch('/db.json');
  const data = await response.json();
  const order = (data.orders || []).find(o => o.id === id);
  return order || null;
};

export const addPO = async (poData) => {
  // This is a read-only operation.
  console.log('Read-only mode: addPO disabled.', poData);
  return Promise.resolve(poData);
};

export const updatePO = async (poId, poData) => {
  // This is a read-only operation.
  console.log('Read-only mode: updatePO disabled.', poId, poData);
  return Promise.resolve(poData);
};

export const deletePO = async (id) => {
  // This is a read-only operation.
  console.log('Read-only mode: deletePO disabled.', id);
  return Promise.resolve();
};
