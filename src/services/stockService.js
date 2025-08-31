import api from './api';

const local = {
  getStockLevels: async () => {
    console.log('Fetching stock levels from hardcoded test data');

    // Hardcoded data from db.json to bypass json-server issues
    const products = [
      { "id": 1, "name": "Wireless Mouse", "sku": "WM-001", "category": "Electronics", "price": 25.99, "costPrice": 15.50, "lowStockThreshold": 20, "createdAt": "2024-11-10T10:00:00Z", "barcode": "8901234567890", "imageUrl": "https://picsum.photos/seed/1/200" },
      { "id": 2, "name": "Mechanical Keyboard", "sku": "MK-001", "category": "Electronics", "price": 120.00, "costPrice": 80.00, "lowStockThreshold": 50, "createdAt": "2025-01-15T11:30:00Z", "barcode": "8902345678901", "imageUrl": "https://picsum.photos/seed/2/200" },
      { "id": 3, "name": "USB-C Hub", "sku": "UCH-001", "category": "Accessories", "price": 45.50, "costPrice": 30.00, "lowStockThreshold": 25, "createdAt": "2025-05-20T14:00:00Z", "barcode": "8903456789012", "imageUrl": "https://picsum.photos/seed/3/200" },
      { "id": 4, "name": "14\" Laptop Sleeve", "sku": "LS-014", "category": "Accessories", "price": 18.99, "costPrice": 10.00, "lowStockThreshold": 50, "createdAt": "2024-09-05T09:00:00Z", "barcode": "8904567890123", "imageUrl": "" },
      { "id": 5, "name": "27\" 4K Monitor", "sku": "M-4K-027", "category": "Monitors", "price": 499.99, "costPrice": 350.00, "lowStockThreshold": 50, "createdAt": "2025-07-22T18:00:00Z", "barcode": "8905678901234", "imageUrl": "https://picsum.photos/seed/5/200" },
      { "id": 6, "name": "Ergonomic Chair", "sku": "EC-001", "category": "Furniture", "price": 299.00, "costPrice": 200.00, "lowStockThreshold": 35, "createdAt": "2024-03-12T12:00:00Z", "barcode": "8906789012345", "imageUrl": "" },
      { "id": 7, "name": "Standing Desk", "sku": "SD-001", "category": "Furniture", "price": 350.00, "costPrice": 250.00, "lowStockThreshold": 20, "createdAt": "2025-06-30T16:45:00Z", "barcode": "8907890123456", "imageUrl": "https://picsum.photos/seed/7/200" },
      { "id": 8, "name": "Webcam 1080p", "sku": "WC-1080", "category": "Electronics", "price": 65.00, "costPrice": 40.00, "lowStockThreshold": 100, "createdAt": "2025-08-01T08:00:00Z", "barcode": "8908901234567", "imageUrl": "https://picsum.photos/seed/8/200" }
    ];
    const stockData = [
      { "id": 1, "productId": 1, "quantity": 150, "batches": [{ "batchNumber": "B001", "expiryDate": "2026-11-10T10:00:00Z", "quantity": 150 }] },
      { "id": 2, "productId": 2, "quantity": 75, "batches": [{ "batchNumber": "B002", "expiryDate": "2026-01-15T11:30:00Z", "quantity": 75 }] },
      { "id": 3, "productId": 3, "quantity": 120, "batches": [{ "batchNumber": "B003", "expiryDate": "2026-05-20T14:00:00Z", "quantity": 120 }] },
      { "id": 4, "productId": 4, "quantity": 0, "batches": [] },
      { "id": 5, "productId": 5, "quantity": 50, "batches": [{ "batchNumber": "B005", "expiryDate": "2026-07-22T18:00:00Z", "quantity": 50 }] },
      { "id": 6, "productId": 6, "quantity": 30, "batches": [{ "batchNumber": "B006", "expiryDate": "2025-03-12T12:00:00Z", "quantity": 30 }] },
      { "id": 7, "productId": 7, "quantity": 40, "batches": [{ "batchNumber": "B007", "expiryDate": "2026-06-30T16:45:00Z", "quantity": 40 }] },
      { "id": 8, "productId": 8, "quantity": 90, "batches": [{ "batchNumber": "B008", "expiryDate": "2026-08-01T08:00:00Z", "quantity": 90 }] }
    ];
    const suppliers = [
      { "id": 1, "name": "ElectroSupply", "contact": "John Doe", "email": "john.doe@electrosupply.com", "products": [1, 2, 8] },
      { "id": 2, "name": "OfficeWorks", "contact": "Jane Smith", "email": "jane.smith@officeworks.com", "products": [3, 4, 6, 7] },
      { "id": 3, "name": "MonitorCorp", "contact": "Sam Wilson", "email": "sam.wilson@monitorcorp.com", "products": [5] }
    ];

    // The rest of the function remains the same
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
  addStock: async ({ productId, quantity, batchNumber, expiryDate }) => {
    console.log('Adding new stock batch in local mode', { productId, quantity, batchNumber, expiryDate });
    const newStockEntry = {
      productId,
      quantity,
      batches: [{ batchNumber, expiryDate, quantity }]
    };
    const response = await fetch('/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStockEntry)
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to add stock: ${errorBody}`);
    }
    return await response.json();
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
  addStock: async ({ productId, quantity, batchNumber, expiryDate }) => {
    console.log('Adding new stock batch via API', { productId, quantity, batchNumber, expiryDate });
    const newStockEntry = {
      productId,
      quantity,
      batches: [{ batchNumber, expiryDate, quantity }]
    };
    return await api.post('/stock', newStockEntry);
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