import api from './api';
import { stockService } from './stockService';

const remote = {
  getPOs: async () => {
    const response = await api.get('/orders?_expand=supplier&_sort=createdAt&_order=desc');
    return response.data;
  },
  getPO: async (id) => {
    const response = await api.get(`/orders/${id}?_expand=supplier`);
    return response.data;
  },
  addPO: async (poData) => {
    const response = await api.post('/orders', poData);
    return response.data;
  },
  updatePO: async (poId, poData) => {
    const response = await api.put(`/orders/${poId}`, poData);
    return response.data;
  },
  deletePO: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
  receivePO: async ({ poId, batchNumber, products }) => {
    // 1. Update PO status to 'Completed'
    const updatedPO = await remote.updatePO(poId, {
      status: 'Completed',
      completedAt: new Date().toISOString(),
    });

    // 2. Add stock for each product in the PO
    const stockAddPromises = products.map(product => {
      return stockService.addStock({
        productId: product.productId,
        quantity: product.quantity,
        batchNumber: batchNumber,
        expiryDate: product.expiryDate,
        supplierId: updatedPO.supplierId,
        createdDate: new Date().toISOString(),
        sizes: product.sizes || [], // Assuming sizes might be part of the PO product data
      });
    });

    await Promise.all(stockAddPromises);

    return updatedPO;
  },
};

export const poService = remote;
