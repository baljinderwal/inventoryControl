import api from './api';

const couponService = {
  getCoupons: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
  },
};

export default couponService;
