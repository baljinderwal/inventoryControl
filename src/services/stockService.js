import api from './api';

const local = {
  getStockLevels: async ({ locationId } = {}) => {
    console.log('Fetching stock levels from local db.json');
    const response = await fetch('/db.json');
    const data = await response.json();
    const products = data.products || [];
    let stockData = data.stock || [];
    if (locationId) {
      stockData = stockData.filter(s => s.locationId === locationId);
    }
    const locations = data.locations || [];
    const suppliers = data.suppliers || [];

    const supplierMap = new Map();
    suppliers.forEach(supplier => {
      supplier.products.forEach(productId => {
        supplierMap.set(productId, supplier.name);
      });
    });

    const locationMap = new Map(locations.map(loc => [loc.id, loc]));
    const stockMap = new Map();

    for (const item of stockData) {
      if (!stockMap.has(item.productId)) {
        stockMap.set(item.productId, []);
      }
      stockMap.get(item.productId).push({
        ...item,
        locationName: locationMap.get(item.locationId)?.name || 'Unknown Location',
      });
    }

    const productStock = new Map();
    products.forEach(p => {
        const stockEntries = stockMap.get(p.id) || [];
        const totalStock = stockEntries.reduce((sum, s) => sum + s.quantity, 0);
        productStock.set(p.id, totalStock);
    });

    return products.map(product => {
      let finalStock = productStock.get(product.id) || 0;
      if (product.type === 'bundle' && product.components) {
        const componentStocks = product.components.map(c => {
          const componentStock = productStock.get(c.productId) || 0;
          return Math.floor(componentStock / c.quantity);
        });
        finalStock = Math.min(...componentStocks);
      }

      return {
        ...product,
        stock: finalStock,
        stockByLocation: stockMap.get(product.id) || [],
        supplierName: supplierMap.get(product.id) || 'N/A',
      };
    });
  },
  adjustStockLevel: async (adjustmentData) => {
    console.warn('Read-only mode: adjustStockLevel disabled.', adjustmentData);
    return Promise.resolve();
  },
  transferStock: async (transferData) => {
    console.warn('Read-only mode: transferStock disabled.', transferData);
    return Promise.resolve();
  },
  getProductWithStock: async (id) => {
    console.log(`Fetching product ${id} with stock from local db.json`);
    const response = await fetch('/db.json');
    const data = await response.json();
    const allProducts = data.products || [];
    const product = allProducts.find(p => p.id === id);
    if (!product) return null;

    if (product.type === 'bundle' && product.components) {
      const productMap = new Map(allProducts.map(p => [p.id, p]));
      product.components = product.components.map(c => ({
        ...c,
        name: productMap.get(c.productId)?.name || 'Unknown Product',
        sku: productMap.get(c.productId)?.sku || 'N/A',
      }));
    }

    let stockData = data.stock || [];
    const locations = data.locations || [];
    const locationMap = new Map(locations.map(loc => [loc.id, loc]));

    const stockEntries = stockData
      .filter(s => s.productId === id)
      .map(s => ({
        ...s,
        locationName: locationMap.get(s.locationId)?.name || 'Unknown Location',
      }));

    const totalStock = stockEntries.reduce((sum, s) => sum + s.quantity, 0);

    return {
      ...product,
      stock: totalStock,
      stockByLocation: stockEntries,
    };
  }
};

const remote = {
  getStockLevels: async ({ locationId } = {}) => {
    console.log('Fetching stock levels from API');
    const stockUrl = locationId ? `/stock?locationId=${locationId}` : '/stock';
    const [productsResponse, stockResponse, locationsResponse, suppliersResponse] = await Promise.all([
      api.get('/products'),
      api.get(stockUrl),
      api.get('/locations'),
      api.get('/suppliers'),
    ]);
    const products = productsResponse.data;
    const stockData = stockResponse.data;
    const locations = locationsResponse.data;
    const suppliers = suppliersResponse.data;

    const supplierMap = new Map();
    suppliers.forEach(supplier => {
      supplier.products.forEach(productId => {
        supplierMap.set(productId, supplier.name);
      });
    });

    const locationMap = new Map(locations.map(loc => [loc.id, loc]));
    const stockMap = new Map();

    for (const item of stockData) {
      if (!stockMap.has(item.productId)) {
        stockMap.set(item.productId, []);
      }
      stockMap.get(item.productId).push({
        ...item,
        locationName: locationMap.get(item.locationId)?.name || 'Unknown Location',
      });
    }

    const productStock = new Map();
    products.forEach(p => {
        const stockEntries = stockMap.get(p.id) || [];
        const totalStock = stockEntries.reduce((sum, s) => sum + s.quantity, 0);
        productStock.set(p.id, totalStock);
    });

    return products.map(product => {
      let finalStock = productStock.get(product.id) || 0;
      if (product.type === 'bundle' && product.components) {
        const componentStocks = product.components.map(c => {
          const componentStock = productStock.get(c.productId) || 0;
          return Math.floor(componentStock / c.quantity);
        });
        finalStock = Math.min(...componentStocks);
      }

      return {
        ...product,
        stock: finalStock,
        stockByLocation: stockMap.get(product.id) || [],
        supplierName: supplierMap.get(product.id) || 'N/A',
      };
    });
  },
  adjustStockLevel: async ({ productId, quantity, batchNumber, expiryDate, locationId }) => {
    console.log('Adjusting stock level via API', { productId, quantity, locationId });
    if (!locationId) throw new Error("Location ID is required for stock adjustments.");

    const stockRes = await api.get(`/stock?productId=${productId}&locationId=${locationId}`);
    let stockEntry = stockRes.data[0];

    if (!stockEntry) {
      if (quantity > 0) {
        const newStockEntry = {
          productId,
          quantity,
          locationId,
          batches: [{ batchNumber, expiryDate, quantity }]
        };
        return await api.post('/stock', newStockEntry);
      } else {
        throw new Error("Cannot deduct stock from a product that has no stock entry at this location.");
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
      if (quantityToDeduct > 0) throw new Error("Not enough stock to fulfill the request at this location.");
      stockEntry.batches = stockEntry.batches.filter(b => b.quantity > 0);
    }

    stockEntry.quantity = stockEntry.batches.reduce((sum, b) => sum + b.quantity, 0);
    return await api.put(`/stock/${stockEntry.id}`, stockEntry);
  },

  transferStock: async ({ productId, fromLocationId, toLocationId, quantity }) => {
    console.log('Transferring stock via API', { productId, fromLocationId, toLocationId, quantity });
    if (fromLocationId === toLocationId) throw new Error("Source and destination locations cannot be the same.");

    // 1. Get stock from the source location
    const fromStockRes = await api.get(`/stock?productId=${productId}&locationId=${fromLocationId}`);
    const fromStock = fromStockRes.data[0];

    if (!fromStock || fromStock.quantity < quantity) {
      throw new Error("Not enough stock at the source location.");
    }

    // 2. Determine which batches to transfer (FEFO)
    let quantityToTransfer = quantity;
    const batchesToTransfer = [];
    fromStock.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    for (const batch of fromStock.batches) {
      if (quantityToTransfer === 0) break;
      const amountFromBatch = Math.min(quantityToTransfer, batch.quantity);

      batchesToTransfer.push({ ...batch, quantity: amountFromBatch });
      batch.quantity -= amountFromBatch;
      quantityToTransfer -= amountFromBatch;
    }

    fromStock.batches = fromStock.batches.filter(b => b.quantity > 0);
    fromStock.quantity = fromStock.batches.reduce((sum, b) => sum + b.quantity, 0);

    // 3. Get or create stock at the destination location
    const toStockRes = await api.get(`/stock?productId=${productId}&locationId=${toLocationId}`);
    let toStock = toStockRes.data[0];

    if (!toStock) {
      toStock = {
        productId,
        locationId: toLocationId,
        quantity: 0,
        batches: []
      };
    }

    // 4. Add transferred batches to the destination
    for (const transferredBatch of batchesToTransfer) {
      const existingBatch = toStock.batches.find(b => b.batchNumber === transferredBatch.batchNumber);
      if (existingBatch) {
        existingBatch.quantity += transferredBatch.quantity;
      } else {
        toStock.batches.push(transferredBatch);
      }
    }
    toStock.quantity = toStock.batches.reduce((sum, b) => sum + b.quantity, 0);

    // 5. Atomically update both locations
    // In a real API, this would be a single transaction. Here we simulate it.
    if (toStock.id) { // It existed before
      await Promise.all([
        api.put(`/stock/${fromStock.id}`, fromStock),
        api.put(`/stock/${toStock.id}`, toStock)
      ]);
    } else { // It's a new stock entry
      await Promise.all([
        api.put(`/stock/${fromStock.id}`, fromStock),
        api.post('/stock', toStock)
      ]);
    }

    return { fromStock, toStock };
  },
  getProductWithStock: async (id) => {
    console.log(`Fetching product ${id} with stock from API`);
    const [productResponse, stockResponse, locationsResponse, allProductsResponse] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/stock?productId=${id}`),
      api.get('/locations'),
      api.get('/products'), // For component name lookup
    ]);

    const product = productResponse.data;
    const stockData = stockResponse.data;
    const locations = locationsResponse.data;
    const allProducts = allProductsResponse.data;
    const locationMap = new Map(locations.map(loc => [loc.id, loc]));

    if (product.type === 'bundle' && product.components) {
      const productMap = new Map(allProducts.map(p => [p.id, p]));
      product.components = product.components.map(c => ({
        ...c,
        name: productMap.get(c.productId)?.name || 'Unknown Product',
        sku: productMap.get(c.productId)?.sku || 'N/A',
      }));
    }

    const stockEntries = stockData.map(s => ({
      ...s,
      locationName: locationMap.get(s.locationId)?.name || 'Unknown Location',
    }));

    // Recalculate virtual stock for the single bundle product
    let totalStock;
    if (product.type === 'bundle' && product.components) {
        const allStockResponse = await api.get('/stock');
        const allStock = allStockResponse.data;
        const productStock = new Map();
        allProducts.forEach(p => {
            const productStockEntries = allStock.filter(s => s.productId === p.id);
            const total = productStockEntries.reduce((sum, s) => sum + s.quantity, 0);
            productStock.set(p.id, total);
        });
        const componentStocks = product.components.map(c => {
          const componentStock = productStock.get(c.productId) || 0;
          return Math.floor(componentStock / c.quantity);
        });
        totalStock = Math.min(...componentStocks);
    } else {
        totalStock = stockEntries.reduce((sum, s) => sum + s.quantity, 0);
    }


    return {
      ...product,
      stock: totalStock,
      stockByLocation: stockEntries,
    };
  }
};

export const stockService = { local, api: remote };
