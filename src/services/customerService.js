import api from './api';

const transformCustomer = (customer) => ({
  ...customer,
});

const apiService = {
  getCustomers: async () => {
    const { data } = await api.get('/customers');
    return data.map(transformCustomer);
  },
  addCustomer: async (customer) => {
    const { data } = await api.post('/customers', customer);
    return data;
  },
  updateCustomer: async (id, customer) => {
    const { data } = await api.put(`/customers/${id}`, customer);
    return data;
  },
  deleteCustomer: async (id) => {
    await api.delete(`/customers/${id}`);
    return { id };
  },
};

export const customerService = apiService;
