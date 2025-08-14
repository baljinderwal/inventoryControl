import api from './api';

export const getStockLevels = async () => {
  // Use json-server's _expand feature to get product and location data
  const response = await api.get('/stock?_expand=product&_expand=location');
  return response.data;
};

export const updateStockLevel = async (stockId, newQuantity) => {
  // This is a PATCH request because we are only updating the quantity property
  const response = await api.patch(`/stock/${stockId}`, { quantity: newQuantity });
  return response.data;
};

export const transferStock = async (productId, fromLocationId, toLocationId, quantity) => {
  // 1. Find the source stock record
  const sourceStockRes = await api.get(`/stock?productId=${productId}&locationId=${fromLocationId}`);
  const sourceStock = sourceStockRes.data[0];

  if (!sourceStock || sourceStock.quantity < quantity) {
    throw new Error('Insufficient stock at the source location.');
  }

  // 2. Find or create the destination stock record
  const destStockRes = await api.get(`/stock?productId=${productId}&locationId=${toLocationId}`);
  let destStock = destStockRes.data[0];

  // 3. Perform the updates
  const sourceUpdate = api.patch(`/stock/${sourceStock.id}`, { quantity: sourceStock.quantity - quantity });

  let destUpdate;
  if (destStock) {
    destUpdate = api.patch(`/stock/${destStock.id}`, { quantity: destStock.quantity + quantity });
  } else {
    // If the product has never been stocked at the destination, create a new stock record
    destUpdate = api.post('/stock', {
      productId,
      locationId: parseInt(toLocationId, 10),
      quantity,
    });
  }

  // 4. Wait for both updates to complete
  const [updatedSource, updatedDest] = await Promise.all([sourceUpdate, destUpdate]);

  return { updatedSource: updatedSource.data, updatedDest: updatedDest.data };
};
