import api from './api';

const local = {
  getStockLevels: async () => {
    console.log('Fetching stock levels from local API endpoints');
    const [productsResponse, stockResponse, suppliersResponse] = await Promise.all([
      fetch('/products'),
      fetch('/stock'),
      fetch('/suppliers')
    ]);

    if (!productsResponse.ok || !stockResponse.ok || !suppliersResponse.ok) {
      throw new Error('Failed to fetch local data');
    }

    const products = await productsResponse.json();
    const stockData = await stockResponse.json();
    const suppliers = await suppliersResponse.json();

    const supplierMap = new Map();
    suppliers.forEach(supplier => {
      if (supplier.products && Array.isArray(supplier.products)) {
        supplier.products.forEach(productId => {
          supplierMap.set(productId, supplier.name);
        });
      }
    });

    const stockMap = new Map();
    stockData.forEach(item => {
      if (!stockMap.has(item.productId)) {
        stockMap.set(item.productId, { quantity: 0, batches: [] });
      }
      const existing = stockMap.get(item.productId);
      existing.quantity += item.quantity;
      // Ensure batches are properly concatenated
      existing.batches = existing.batches.concat(item.batches);
    });

    return products.map(product => {
      const stockInfo = stockMap.get(product.id) || { quantity: 0, batches: [] };
      return {
        ...product,
        stock: stockInfo.quantity,
        batches: stockInfo.batches,
        supplierName: supplierMap.get(product.id) || 'N/A',
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
  addStock: async ({ productId, quantity, batchNumber, expiryDate, sizes, createdDate }) => {
    console.log('Adding new stock batch in local mode', { productId, quantity, batchNumber, expiryDate, sizes, createdDate });

    const res = await fetch(`/stock?productId=${productId}`);
    const stockEntries = await res.json();
    let stockEntry = stockEntries[0];

    if (stockEntry) {
      // Update existing stock entry
      stockEntry.quantity += quantity;
      stockEntry.batches.push({ batchNumber, expiryDate, quantity, sizes, createdDate });

      // Update sizes
      if (!stockEntry.sizes) {
        stockEntry.sizes = [];
      }
      sizes.forEach(size => {
        const existingSize = stockEntry.sizes.find(s => s.size === size.size);
        if (existingSize) {
          existingSize.quantity += size.quantity;
        } else {
          stockEntry.sizes.push(size);
        }
      });

      const putRes = await fetch(`/stock/${stockEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockEntry)
      });
      return await putRes.json();
    } else {
      // Create new stock entry
      const newStockEntry = {
        productId,
        quantity,
        sizes,
        batches: [{ batchNumber, expiryDate, quantity, sizes, createdDate }]
      };
      const postRes = await fetch('/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStockEntry)
      });
      return await postRes.json();
    }
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
    const [productsResponse, stockResponse, suppliersResponse] = await Promise.all([
      api.get('/products'),
      api.get(stockUrl),
      api.get('/suppliers'),
    ]);
    const products = productsResponse.data;
    const stockData = stockResponse.data;
    const suppliers = suppliersResponse.data;

    const supplierMap = new Map();
    suppliers.forEach(supplier => {
      // Defensively check if supplier.products exists and is an array
      if (supplier.products && Array.isArray(supplier.products)) {
        supplier.products.forEach(productId => {
          supplierMap.set(productId, supplier.name);
        });
      }
    });

    const stockMap = new Map();

    for (const item of stockData) {
      if (!stockMap.has(item.productId)) {
        stockMap.set(item.productId, { quantity: 0, batches: [] });
      }
      const existing = stockMap.get(item.productId);
      existing.quantity += item.quantity;
      existing.batches.push(...item.batches);
    }

    return products.map(product => {
      const stockInfo = stockMap.get(product.id) || { quantity: 0, batches: [] };
      return {
        ...product,
        stock: stockInfo.quantity,
        batches: stockInfo.batches,
        supplierName: supplierMap.get(product.id) || 'N/A',
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
  addStock: async ({ productId, quantity, batchNumber, expiryDate, sizes, createdDate }) => {
    console.log('Adding new stock batch via API', { productId, quantity, batchNumber, expiryDate, sizes, createdDate });

    const stockRes = await api.get(`/stock?productId=${productId}`);
    let stockEntry = stockRes.data[0];

    if (stockEntry) {
      // Update existing stock entry
      stockEntry.quantity += quantity;
      stockEntry.batches.push({ batchNumber, expiryDate, quantity, sizes, createdDate });

      // Update sizes
      if (!stockEntry.sizes) {
        stockEntry.sizes = [];
      }
      sizes.forEach(size => {
        const existingSize = stockEntry.sizes.find(s => s.size === size.size);
        if (existingSize) {
          existingSize.quantity += size.quantity;
        } else {
          stockEntry.sizes.push(size);
        }
      });

      return await api.put(`/stock/${stockEntry.id}`, stockEntry);
    } else {
      // Create new stock entry
      const newStockEntry = {
        productId,
        quantity,
        sizes,
        batches: [{ batchNumber, expiryDate, quantity, sizes, createdDate }]
      };
      return await api.post('/stock', newStockEntry);
    }
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