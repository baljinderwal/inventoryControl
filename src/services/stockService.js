// import api from './api';

/**
 * Fetches both products and their detailed stock information from the static db.json,
 * then merges them.
 * This provides a comprehensive view of each product's stock, including total quantity
 * and batch details.
 */
export const getStockLevels = async () => {
  // const [productsResponse, stockResponse] = await Promise.all([
  //   api.get('/products'),
  //   api.get('/stock')
  // ]);
  // const products = productsResponse.data;
  // const stockData = stockResponse.data;

  const response = await fetch('/db.json');
  const data = await response.json();
  const products = data.products || [];
  const stockData = data.stock || [];


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
      stockId: stockInfo ? stockInfo.id : null,
    };
  });
};

/**
 * Adjusts the stock level for a product. This is a read-only operation.
 */
export const adjustStockLevel = async (adjustmentData) => {
  console.log('Read-only mode: adjustStockLevel disabled.', adjustmentData);
  return Promise.resolve();
};
