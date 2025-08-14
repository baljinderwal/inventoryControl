// import api from './api';

export const getProfitabilityReportData = async () => {
  // const [productsResponse, ordersResponse] = await Promise.all([
  //   api.get('/products'),
  //   api.get('/orders?status=Completed')
  // ]);
  // const products = productsResponse.data;
  // const orders = ordersResponse.data;

  const response = await fetch('/db.json');
  const data = await response.json();
  const products = data.products || [];
  const orders = (data.orders || []).filter(o => o.status === 'Completed');

  return { products, orders };
};

export const getSalesHistory = async () => {
  // const [productsResponse, ordersResponse] = await Promise.all([
  //   api.get('/products'),
  //   api.get('/orders?status=Completed')
  // ]);
  // const products = productsResponse.data;
  // const orders = ordersResponse.data;

  const response = await fetch('/db.json');
  const data = await response.json();
  const products = data.products || [];
  const orders = (data.orders || []).filter(o => o.status === 'Completed');


  if (!products.length || !orders.length) {
    return [];
  }

  const productMap = new Map(products.map(p => [p.id, p]));

  const salesHistory = orders
    .filter(order => order.completedAt)
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
    .sort((a, b) => b.completedAt - a.completedAt);

  return salesHistory;
};

export const getInventoryAging = async () => {
  // const [productsResponse, stockResponse] = await Promise.all([
  //   api.get('/products'),
  //   api.get('/stock')
  // ]);
  // const products = productsResponse.data;
  // const stock = stockResponse.data;

  const response = await fetch('/db.json');
  const data = await response.json();
  const products = data.products || [];
  const stock = data.stock || [];


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
    .sort((a, b) => b.ageInDays - a.ageInDays);

  return agingReport;
};

export const getSupplierPerformance = async () => {
  // const [suppliersResponse, ordersResponse, productsResponse] = await Promise.all([
  //   api.get('/suppliers'),
  //   api.get('/orders'),
  //   api.get('/products')
  // ]);
  // const suppliers = suppliersResponse.data;
  // const orders = ordersResponse.data;
  // const products = productsResponse.data;

  const response = await fetch('/db.json');
  const data = await response.json();
  const suppliers = data.suppliers || [];
  const orders = data.orders || [];
  const products = data.products || [];


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
