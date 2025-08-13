import api from './api';

// In a real API, you might fetch stock levels joined with product data.
// With json-server, we'll fetch products and use their stock property.
// This service will focus on stock *adjustments*.

export const getStockLevels = async () => {
  // We'll fetch products and extract stock info from there in the component
  // as json-server doesn't support complex joins easily.
  // This function is a placeholder for a real endpoint.
  // const response = await api.get('/products');
  // return response.data;

  // For the sake of this example, we will fetch products from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.products || [];
};

export const updateStockLevel = async (productId, newStockLevel) => {
  // This is a PATCH request because we are only updating the stock property
  const response = await api.patch(`/products/${productId}`, { stock: newStockLevel });
  return response.data;
};
