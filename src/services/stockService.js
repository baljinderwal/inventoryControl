import api from './api';

const local = {
  getStockLevels: async () => {
    console.log('Fetching stock levels from local API endpoints');
    const fetchOptions = { cache: 'no-cache' };
    const [productsResponse, stockResponse, suppliersResponse] = await Promise.all([
      fetch('/products', fetchOptions),
      fetch('/stock', fetchOptions),
      fetch('/suppliers', fetchOptions)
    ]);

    if (!productsResponse.ok || !stockResponse.ok || !suppliersResponse.ok) {
      throw new Error('Failed to fetch local data');
    }

    const products = await productsResponse.json();
    const stockData = await stockResponse.json();
    const suppliers = await suppliersResponse.json();

    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const stockByProduct = stockData.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          quantity: 0,
          batches: [],
          supplierIds: new Set(),
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].batches.push(...item.batches);
      if (item.supplierId) {
        acc[item.productId].supplierIds.add(item.supplierId);
      }
      return acc;
    }, {});

    return products.map(product => {
      const stockInfo = stockByProduct[product.id] || { quantity: 0, batches: [], supplierIds: new Set() };
      const supplierNames = [...stockInfo.supplierIds].map(id => supplierMap.get(id) || 'N/A').join(', ');

      return {
        ...product,
        stock: stockInfo.quantity,
        batches: stockInfo.batches,
        supplierName: supplierNames,
      };
    });
  },
  adjustStockLevel: async ({ productId, quantity, batchNumber = 'B-LOCAL', expiryDate = new Date().toISOString() }) => {
    console.log('Adjusting stock level in local mode', { productId, quantity });

    const res = await fetch(`/stock?productId=${productId}`);
    const stockEntries = await res.json();
    let stockEntry = stockEntries[0];

    if (!stockEntry) {
      if (quantity > 0) {
        const newStockEntry = {
          productId,
          quantity,
          batches: [{ batchNumber, expiryDate, quantity }]
        };
        const postRes = await fetch('/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStockEntry)
        });
        return await postRes.json();
      } else {
        console.error("Cannot deduct stock from a product that has no stock entry.");
        throw new Error("Cannot deduct stock from a product that has no stock entry.");
      }
    }

    if (quantity > 0) {
      // Add stock - for simplicity, add to a new or existing batch
      const existingBatchIndex = stockEntry.batches.findIndex(b => b.batchNumber === batchNumber);
      if (existingBatchIndex > -1) {
        stockEntry.batches[existingBatchIndex].quantity += quantity;
      } else {
        stockEntry.batches.push({ batchNumber, expiryDate, quantity });
      }
    } else {
      // Remove stock - for simplicity, deduct from batches, oldest first (if expiry is valid) or just first.
      let quantityToDeduct = Math.abs(quantity);

      // Basic FEFO logic for local dev
      stockEntry.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      for (const batch of stockEntry.batches) {
        if (quantityToDeduct === 0) break;
        const deduction = Math.min(quantityToDeduct, batch.quantity);
        batch.quantity -= deduction;
        quantityToDeduct -= deduction;
      }
      if (quantityToDeduct > 0) {
         console.error("Not enough stock to fulfill the request.");
         throw new Error("Not enough stock to fulfill the request.");
      }
      stockEntry.batches = stockEntry.batches.filter(b => b.quantity > 0);
    }

    stockEntry.quantity = stockEntry.batches.reduce((sum, b) => sum + b.quantity, 0);

    const putRes = await fetch(`/stock/${stockEntry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stockEntry)
    });
    return await putRes.json();
  },
  addStock: async ({ productId, supplierId, quantity, batchNumber, expiryDate, sizes, createdDate }) => {
    console.log('Adding new stock batch in local mode', { productId, supplierId, quantity, batchNumber, expiryDate, sizes, createdDate });

    const res = await fetch(`/stock?productId=${productId}&supplierId=${supplierId}`);
    const stockEntries = await res.json();
    let stockEntry = stockEntries[0];

    if (stockEntry && stockEntry.id) {
      stockEntry.quantity += quantity;
      stockEntry.batches.push({ batchNumber, expiryDate, quantity, sizes, createdDate, supplierId });
      if (sizes && sizes.length > 0) {
        if (!stockEntry.sizes) stockEntry.sizes = [];
        sizes.forEach(size => {
          const existingSize = stockEntry.sizes.find(s => s.size === size.size);
          if (existingSize) {
            existingSize.quantity += size.quantity;
          } else {
            stockEntry.sizes.push(size);
          }
        });
      }
      const putRes = await fetch(`/stock/${stockEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockEntry)
      });
      return await putRes.json();
    } else {
      const newStockEntry = {
        productId,
        supplierId,
        quantity,
        sizes: sizes || [],
        batches: [{ batchNumber, expiryDate, quantity, sizes, createdDate, supplierId }]
      };
      const postRes = await fetch('/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStockEntry)
      });
      return await postRes.json();
    }
  },
  updateBatchSupplier: async ({ productId, batchNumber, supplierId }) => {
    console.log('Updating batch supplier in local mode', { productId, batchNumber, supplierId });
    const res = await fetch(`/stock?productId=${productId}`);
    const stockEntries = await res.json();
    let stockEntry = stockEntries[0];

    if (!stockEntry) {
      throw new Error("Stock entry not found for this product.");
    }

    const batchIndex = stockEntry.batches.findIndex(b => b.batchNumber === batchNumber);
    if (batchIndex === -1) {
      throw new Error("Batch not found.");
    }

    stockEntry.batches[batchIndex].supplierId = supplierId;

    const putRes = await fetch(`/stock/${stockEntry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stockEntry)
    });
    return await putRes.json();
  },
  getProductWithStock: async (id) => {
    console.log(`Fetching product ${id} with stock from local db.json`);
    const response = await fetch('/db.json');
    const data = await response.json();
    const product = data.products.find(p => p.id === id);
    if (!product) return null;

    let stockData = data.stock || [];
    const stockEntry = stockData.find(s => s.productId === id);

    return {
      ...product,
      stock: stockEntry ? stockEntry.quantity : 0,
      batches: stockEntry ? stockEntry.batches : [],
    };
  }
};

const remote = {
  getStockLevels: async () => {
    console.log('Fetching stock levels from API');
    const stockUrl = '/stock';
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    };
    const [productsResponse, stockResponse, suppliersResponse] = await Promise.all([
      api.get('/products', config),
      api.get(stockUrl, config),
      api.get('/suppliers', config),
    ]);
    const products = productsResponse.data;
    const stockData = stockResponse.data;
    const suppliers = suppliersResponse.data;

    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const stockByProduct = stockData.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          quantity: 0,
          batches: [],
          supplierIds: new Set(),
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].batches.push(...item.batches);
      if (item.supplierId) {
        acc[item.productId].supplierIds.add(item.supplierId);
      }
      return acc;
    }, {});

    return products.map(product => {
      const stockInfo = stockByProduct[product.id] || { quantity: 0, batches: [], supplierIds: new Set() };
      const supplierNames = [...stockInfo.supplierIds].map(id => supplierMap.get(id) || 'N/A').join(', ');

      return {
        ...product,
        stock: stockInfo.quantity,
        batches: stockInfo.batches,
        supplierName: supplierNames,
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
    return await api.put(`/stock/${stockEntry.productId}`, stockEntry);
  },
  addStock: async ({ productId, supplierId, quantity, batchNumber, expiryDate, sizes, createdDate }) => {
    console.log('Adding new stock batch via API', { productId, supplierId, quantity, batchNumber, expiryDate, sizes, createdDate });

    const stockRes = await api.get(`/stock?productId=${productId}&supplierId=${supplierId}`);
    let stockEntry = stockRes.data[0];

    if (stockEntry && stockEntry.id) {
      stockEntry.quantity += quantity;
      stockEntry.batches.push({ batchNumber, expiryDate, quantity, sizes, createdDate, supplierId });
      if (sizes && sizes.length > 0) {
        if (!stockEntry.sizes) stockEntry.sizes = [];
        sizes.forEach(size => {
          const existingSize = stockEntry.sizes.find(s => s.size === size.size);
          if (existingSize) {
            existingSize.quantity += size.quantity;
          } else {
            stockEntry.sizes.push(size);
          }
        });
      }
      return await api.put(`/stock/${stockEntry.id}`, stockEntry);
    } else {
      const newStockEntry = {
        productId,
        supplierId,
        quantity,
        sizes: sizes || [],
        batches: [{ batchNumber, expiryDate, quantity, sizes, createdDate, supplierId }]
      };
      return await api.post('/stock', newStockEntry);
    }
  },
  updateBatchSupplier: async ({ productId, batchNumber, supplierId }) => {
    console.log('Updating batch supplier via API', { productId, batchNumber, supplierId });
    const stockRes = await api.get(`/stock?productId=${productId}`);
    let stockEntry = stockRes.data[0];

    if (!stockEntry) {
      throw new Error("Stock entry not found for this product.");
    }

    const batchIndex = stockEntry.batches.findIndex(b => b.batchNumber === batchNumber);
    if (batchIndex === -1) {
      throw new Error("Batch not found.");
    }

    stockEntry.batches[batchIndex].supplierId = supplierId;

    return await api.put(`/stock/${stockEntry.id}`, stockEntry);
  },
  getProductWithStock: async (id) => {
    console.log(`Fetching product ${id} with stock from API`);
    const [productResponse, stockResponse] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/stock?productId=${id}`),
    ]);

    const product = productResponse.data;
    const stockEntry = stockResponse.data[0];

    return {
      ...product,
      stock: stockEntry ? stockEntry.quantity : 0,
      batches: stockEntry ? stockEntry.batches : [],
    };
  }
};

export const stockService = { local, api: remote };