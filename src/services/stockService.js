import api from './api';

/**
 * Fetches both products and their detailed stock information, then merges them.
 * This provides a comprehensive view of each product's stock, including total quantity
 * and batch details.
 */
export const getStockLevels = async () => {
  // Fetch both products and stock data in parallel
  const [productsResponse, stockResponse] = await Promise.all([
    api.get('/products'),
    api.get('/stock')
  ]);

  const products = productsResponse.data;
  const stockData = stockResponse.data;

  // Create a map of productId to stock info for efficient lookup
  const stockMap = new Map(stockData.map(item => [item.productId, item]));

  // Merge the product data with its corresponding stock information
  return products.map(product => {
    const stockInfo = stockMap.get(product.id);
    const totalStock = stockInfo ? stockInfo.quantity : 0;
    const batches = stockInfo ? stockInfo.batches : [];

    return {
      ...product,
      stock: totalStock, // Denormalized total stock for display
      batches,         // Detailed batch information
      stockId: stockInfo ? stockInfo.id : null, // ID of the stock entry for updates
    };
  });
};

/**
 * Adjusts the stock level for a product. It can handle both adding stock (with batch info)
 * and removing stock (using FEFO logic).
 *
 * @param {object} params - The parameters for the stock adjustment.
 * @param {number} params.productId - The ID of the product to adjust.
 * @param {number} params.quantity - The quantity to add or remove (positive for add, negative for remove).
 * @param {string} [params.batchNumber] - The batch number for new stock (required for additions).
 * @param {string} [params.expiryDate] - The expiry date for new stock (required for additions).
 */
export const adjustStockLevel = async ({ productId, quantity, batchNumber, expiryDate }) => {
  // First, get the current stock entry for the product
  const stockRes = await api.get(`/stock?productId=${productId}`);
  let stockEntry = stockRes.data[0];

  if (!stockEntry) {
    // If no stock entry exists, create a new one (only for stock-in)
    if (quantity > 0) {
      const newStockEntry = {
        productId,
        quantity,
        warehouse: 'A', // Default warehouse, can be changed later
        batches: [{ batchNumber, expiryDate, quantity }]
      };
      const response = await api.post('/stock', newStockEntry);
      return response.data;
    } else {
      throw new Error("Cannot deduct stock from a product that has no stock entry.");
    }
  }

  // Handle Stock In (adding a new batch or quantity to an existing one)
  if (quantity > 0) {
    if (!batchNumber || !expiryDate) {
      throw new Error("Batch number and expiry date are required for stock additions.");
    }

    const existingBatchIndex = stockEntry.batches.findIndex(b => b.batchNumber === batchNumber);

    if (existingBatchIndex > -1) {
      // If batch exists, update its quantity
      stockEntry.batches[existingBatchIndex].quantity += quantity;
    } else {
      // Otherwise, add a new batch
      stockEntry.batches.push({ batchNumber, expiryDate, quantity });
    }
  }
  // Handle Stock Out (deducting from batches using FEFO)
  else {
    let quantityToDeduct = Math.abs(quantity);

    // Sort batches by expiry date, oldest first (FEFO)
    stockEntry.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    for (const batch of stockEntry.batches) {
      if (quantityToDeduct === 0) break;

      const deduction = Math.min(quantityToDeduct, batch.quantity);
      batch.quantity -= deduction;
      quantityToDeduct -= deduction;
    }

    if (quantityToDeduct > 0) {
      throw new Error("Not enough stock to fulfill the request.");
    }

    // Filter out empty batches
    stockEntry.batches = stockEntry.batches.filter(b => b.quantity > 0);
  }

  // Recalculate the total quantity
  stockEntry.quantity = stockEntry.batches.reduce((sum, b) => sum + b.quantity, 0);

  // Update the stock entry in the database
  const response = await api.put(`/stock/${stockEntry.id}`, stockEntry);
  return response.data;
};
