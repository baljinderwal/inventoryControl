import api from './api';

export const getStock = async () => {
  // Reuse backend endpoint used by web: /stock
  const res = await api.get('/stock');
  return res.data;
};

export default { getStock };
