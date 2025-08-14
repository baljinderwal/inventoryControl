import api from './api';

const local = {
  getStockLevels: async () => {
    console.log('Fetching stock levels from local db.json');
    const response = await fetch('/db.json');
    const data = await response.json();
    const products = data.products || [];
    const stockData = data.stock || [];

    const stockMap = new Map(stockData.map(item => [item.productId, item]));

    return products.map(product => {
      const stockInfo = stockMap.get(product.id);
      return {
        ...product,
        stock: stockInfo ? stockInfo.quantity : 0,
        batches: stockInfo ? stockInfo.batches : [],
        stockId: stockInfo ? stockInfo.id : null,
      };
    });
  },
  adjustStockLevel: async (adjustmentData) => {
    console.warn('Read-only mode: adjustStockLevel disabled.', adjustmentData);
    return Promise.resolve();
  },
};

const remote = {
  getStockLevels: async () => {
    console.log('Fetching stock levels from API');
    const [productsResponse, stockResponse] = await Promise.all([
      api.get('/products'),
      api.get('/stock')
    ]);
    const products = productsResponse.data;
    const stockData = stockResponse.data;

    const stockMap = new Map(stockData.map(item => [item.productId, item]));

    return products.map(product => {
      const stockInfo = stockMap.get(product.id);
      return {
        ...product,
        stock: stockInfo ? stockInfo.quantity : 0,
        batches: stockInfo ? stockInfo.batches : [],
        stockId: stockInfo ? stockInfo.id : null,
      };
    });
  },
  adjustStockLevel: async ({ productId, quantity, batchNumber, expiryDate }) => {
    console.log('Adjusting stock level via API', { productId, quantity });
    const stockRes = await api.get(`/stock?productId=${productId}`);
    let stockEntry = stockRes.data[0];

    if (!stockEntry) {
      if (quantity > 0) {
        const newStockEntry = {
          productId,
          quantity,
          warehouse: 'A',
          batches: [{ batchNumber, expiryDate, quantity }]
        };
        return await api.post('/stock', newStockEntry);
      } else {
        throw new Error("Cannot deduct stock from a product that has no stock entry.");
      }
    }

    if (quantity > 0) {
      if (!batchNumber || !expiryDate) throw new Error("Batch number and expiry date are required for stock additions.");
      const existingBatchIndex = stockEntry.batches.findIndex(b => b.batchNumber === batchNumber);
      if (existingBatchIndex > -1) {
        stockEntry.batches[existingBatchIndex].quantity += quantity;
      } else {
        stockEntry.batches.push({ batchNumber, expiryDate, quantity });
      }
    } else {
      let quantityToDeduct = Math.abs(quantity);
      stockEntry.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
      for (const batch of stockEntry.batches) {
        if (quantityToDeduct === 0) break;
        const deduction = Math.min(quantityToDeduct, batch.quantity);
        batch.quantity -= deduction;
        quantityToDeduct -= deduction;
      }
      if (quantityToDeduct > 0) throw new Error("Not enough stock to fulfill the request.");
      stockEntry.batches = stockEntry.batches.filter(b => b.quantity > 0);
    }

    stockEntry.quantity = stockEntry.batches.reduce((sum, b) => sum + b.quantity, 0);
    return await api.put(`/stock/${stockEntry.id}`, stockEntry);
  },
};

export const stockService = { local, api: remote };
