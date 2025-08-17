import api from './api';
import localDb from '../../public/db.json';

const local = {
  getInvoices: async () => {
    return localDb.invoices;
  },
  createInvoice: async (invoice) => {
    // This is a mock implementation for local mode.
    // In a real app, you would persist this change.
    console.log('Creating invoice in local mode:', invoice);
    const newInvoice = { ...invoice, id: Date.now() };
    localDb.invoices.push(newInvoice);
    return newInvoice;
  },
};

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

export default {
  local,
  api: services,
};
