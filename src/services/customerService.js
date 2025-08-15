import api from './api';

const transformCustomer = (customer) => ({
  ...customer,
});

const local = {
  getCustomers: async () => {
    console.log("Fetching local customers");
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.customers.map(transformCustomer);
  },
  addCustomer: async (customer) => {
    console.warn("Read-only mode: addCustomer disabled.", customer);
    return Promise.resolve({ ...customer, id: new Date().getTime() });
  },
  updateCustomer: async (id, customer) => {
    console.warn("Read-only mode: updateCustomer disabled.", id, customer);
    return Promise.resolve({ ...customer, id });
  },
  deleteCustomer: async (id) => {
    console.warn("Read-only mode: deleteCustomer disabled.", id);
    return Promise.resolve({ id });
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
