import api from './api';

export const getProfitabilityReportData = async () => {
  const [productsResponse, ordersResponse] = await Promise.all([
    api.get('/products'),
    api.get('/orders?status=Completed') // Fetch only completed orders for profitability
  ]);
  return { products: productsResponse.data, orders: ordersResponse.data };
};

export const getSalesHistory = async () => {
  const [productsResponse, ordersResponse] = await Promise.all([
    api.get('/products'),
    api.get('/orders?status=Completed')
  ]);
  const products = productsResponse.data;
  const orders = ordersResponse.data;


  if (!products.length || !orders.length) {
    return [];
  }

  const productMap = new Map(products.map(p => [p.id, p]));

  const salesHistory = orders
    .filter(order => order.completedAt) // Ensure completedAt exists
    .flatMap(order =>
      order.products.map(item => {
        const product = productMap.get(item.productId);
        return {
          orderId: order.id,
          completedAt: new Date(order.completedAt),
          productName: product ? product.name : 'Unknown Product',
          quantity: item.quantity,
          price: product ? product.price : 0,
          totalSale: product ? item.quantity * product.price : 0,
        };
      })
    )
    .sort((a, b) => b.completedAt - a.completedAt); // Sort by most recent

  return salesHistory;
};

export const getInventoryAging = async () => {
  const [productsResponse, stockResponse] = await Promise.all([
    api.get('/products'),
    api.get('/stock')
  ]);
  const products = productsResponse.data;
  const stock = stockResponse.data;

  if (!products.length) {
    return [];
  }

  const stockMap = new Map(stock.map(s => [s.productId, s.quantity]));

  const today = new Date();
  const agingReport = products
    .map(product => ({
      ...product,
      stock: stockMap.get(product.id) || 0,
    }))
    .filter(p => p.stock > 0 && p.createdAt)
    .map(product => {
      const createdAt = new Date(product.createdAt);
      const ageInDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));
      return {
        ...product,
        ageInDays,
      };
    })
    .sort((a, b) => b.ageInDays - a.ageInDays); // Sort by oldest first

  return agingReport;
};

export const getSupplierPerformance = async () => {
  const [suppliersResponse, ordersResponse, productsResponse] = await Promise.all([
    api.get('/suppliers'),
    api.get('/orders'),
    api.get('/products')
  ]);
  const suppliers = suppliersResponse.data;
  const orders = ordersResponse.data;
  const products = productsResponse.data;

  if (!suppliers.length || !orders.length) {
    return [];
  }

  const productMap = new Map(products.map(p => [p.id, p]));

  const supplierPerformance = suppliers.map(supplier => {
    const supplierOrders = orders.filter(order => order.supplier.id === supplier.id);
    const totalOrders = supplierOrders.length;
    const completedOrders = supplierOrders.filter(o => o.status === 'Completed').length;
    const pendingOrders = totalOrders - completedOrders;

    const totalValue = supplierOrders.reduce((sum, order) => {
      return sum + order.products.reduce((orderSum, item) => {
        const product = productMap.get(item.productId);
        return orderSum + (product ? item.quantity * product.price : 0);
      }, 0);
    }, 0);

    return {
      ...supplier,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalValue,
    };
  });

  return supplierPerformance;
};
