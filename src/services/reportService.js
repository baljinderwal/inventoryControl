import api from './api';

export const getProfitabilityReportData = async () => {
  // In a real application, you might have a dedicated endpoint for this report.
  // For this example, we fetch both products and orders and combine them on the client-side.

  // const [productsResponse, ordersResponse] = await Promise.all([
  //   api.get('/products'),
  //   api.get('/orders')
  // ]);
  // return { products: productsResponse.data, orders: ordersResponse.data };

  // For the sake of this example, we will fetch the whole db.json file
  // and extract the products and orders from it.
  const response = await fetch('/db.json');
  const data = await response.json();
  return {
    products: data.products || [],
    orders: data.orders || [],
  };
};
