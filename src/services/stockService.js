import api from './api';

/**
 * Fetches all the necessary data for the inventory pages from the server.
 * As json-server doesn't support joins, we fetch all resources and
 * join them on the client-side.
 */
export const getInventoryData = async () => {
  const [productsRes, locationsRes, inventoryBatchesRes] = await Promise.all([
    api.get('/products'),
    api.get('/locations'),
    api.get('/inventoryBatches'),
  ]);

  return {
    products: productsRes.data,
    locations: locationsRes.data,
    inventoryBatches: inventoryBatchesRes.data,
  };
};

/**
 * Adds a new inventory batch record.
 * @param {object} batch - The new batch data.
 * @returns {Promise<object>}
 */
export const addInventoryBatch = async (batch) => {
  const response = await api.post('/inventoryBatches', batch);
  return response.data;
};

/**
 * Updates an existing inventory batch.
 * @param {number} id - The ID of the batch to update.
 * @param {object} batch - The partial data to update.
 * @returns {Promise<object>}
 */
export const updateInventoryBatch = async (id, batch) => {
  const response = await api.patch(`/inventoryBatches/${id}`, batch);
  return response.data;
};

/**
 * Deletes an inventory batch.
 * @param {number} id - The ID of the batch to delete.
 * @returns {Promise<object>}
 */
export const deleteInventoryBatch = async (id) => {
  const response = await api.delete(`/inventoryBatches/${id}`);
  return response.data;
};
