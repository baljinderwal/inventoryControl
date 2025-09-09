import api from './api';

const services = {
  getInvoices: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },
  createInvoice: async (invoice) => {
    const response = await api.post('/invoices', invoice);
    return response.data;
  },
};

export default services;
