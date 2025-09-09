import api from './api';

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
  adjustStockLevel: async ({ productId, quantity, batchNumber, sizes }) => {
    console.log('Adjusting stock level via API', { productId, quantity, batchNumber, sizes });

    const stockRes = await api.get(`/stock?productId=${productId}`);
    if (stockRes.data.length === 0) {
      throw new Error(`No stock entry found for product ${productId}.`);
    }
    let stockEntry = stockRes.data[0];

    const batchIndex = stockEntry.batches.findIndex(b => b.batchNumber === batchNumber);
    if (batchIndex === -1) {
      throw new Error(`Batch ${batchNumber} not found for product ${productId}.`);
    }
    const batch = stockEntry.batches[batchIndex];

    if (sizes && sizes.length > 0) {
      // Size-specific adjustment
      if (!batch.sizes) batch.sizes = [];
      sizes.forEach(adj => {
        const sizeIndex = batch.sizes.findIndex(s => s.size === adj.size);
        if (sizeIndex > -1) {
          batch.sizes[sizeIndex].quantity += adj.quantity;
          if (batch.sizes[sizeIndex].quantity < 0) {
            throw new Error(`Not enough stock for size ${adj.size} in batch ${batchNumber}.`);
          }
        } else if (adj.quantity > 0) {
          batch.sizes.push({ size: adj.size, quantity: adj.quantity });
        }
      });
      batch.quantity = batch.sizes.reduce((sum, s) => sum + s.quantity, 0);
    } else {
      // Non-size-specific adjustment
      batch.quantity += quantity;
      if (batch.quantity < 0) {
        throw new Error(`Not enough stock in batch ${batchNumber}.`);
      }
    }

    stockEntry.batches[batchIndex] = batch;
    stockEntry.batches = stockEntry.batches.filter(b => b.quantity > 0);
    stockEntry.quantity = stockEntry.batches.reduce((sum, b) => sum + b.quantity, 0);

    return await api.put(`/stock/${productId}`, stockEntry);
  },
  addStock: async ({ productId, supplierId, quantity, batchNumber, expiryDate, sizes, createdDate }) => {
    console.log('Adding new stock batch via API', { productId, supplierId, quantity, batchNumber, expiryDate, sizes, createdDate });

    let stockEntry;
    try {
      const stockQueryRes = await api.get(`/stock/${productId}`);
      if (stockQueryRes.data.length > 0) {
        // First get the ID from the query result.
        const stockId = stockQueryRes.data[0].id;
        // Then, fetch the full entry by its ID to ensure we have the complete object.
        const stockFullRes = await api.get(`/stock/${productId}`);
        stockEntry = stockFullRes.data;
      } else {
        stockEntry = null;
      }
    } catch (error) {
      console.error("Error fetching stock for product", productId, error);
      stockEntry = null;
    }

    if (stockEntry) {
      stockEntry.quantity += quantity;
      if (!stockEntry.batches) {
        stockEntry.batches = [];
      }
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

export const stockService = remote;