import api from './api';

export const getPOs = async () => {
  const res = await api.get('/orders?_expand=supplier');
  return res.data;
};

export const addPO = async (poData) => {
  const res = await api.post('/orders', poData);
  return res.data;
};

export default { getPOs, addPO };
