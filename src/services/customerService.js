import api from './api';
import * as data from '/db.json';

const transformCustomer = (customer) => ({
  ...customer,
});

const local = {
  getCustomers: async () => {
    console.log("Fetching local customers");
    return data.customers.map(transformCustomer);
  },
  addCustomer: async (customer) => {
    console.log("Adding local customer", customer);
    // This is a mock, in a real scenario you'd update the source
    return { ...customer, id: new Date().getTime() };
  },
  updateCustomer: async (id, customer) => {
    console.log("Updating local customer", id, customer);
    return { ...customer, id };
  },
  deleteCustomer: async (id) => {
    console.log("Deleting local customer", id);
    return { id };
  },
};

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

export const customerService = {
  local,
  api: apiService,
};
