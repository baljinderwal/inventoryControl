import api from './api';

export const getSuppliers = async () => {
  const res = await api.get('/suppliers');
  return res.data;
};

export default { getSuppliers };
