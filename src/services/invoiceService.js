import api from './api';

const local = {
  getInvoices: async () => {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.invoices || [];
  },
  createInvoice: async (invoice) => {
    // Local mode is mostly for reading. We'll simulate a successful creation
    // without actually modifying the static db.json file.
    console.warn('Read-only mode: createInvoice simulated.', invoice);
    return Promise.resolve({ ...invoice, id: `temp-${Date.now()}` });
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
