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

export const getSalesHistory = async () => {
  const response = await fetch('/db.json');
  const data = await response.json();
  const { products = [], orders = [] } = data;

  if (!products.length || !orders.length) {
    return [];
  }

  const productMap = new Map(products.map(p => [p.id, p]));

  const salesHistory = orders
    .filter(order => order.status === 'Completed' && order.completedAt)
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

export const getInventoryAging = async (locationId = null) => {
  // To get product info, we need to fetch stock with product expanded
  const url = locationId
    ? `/stock?_expand=product&locationId=${locationId}`
    : '/stock?_expand=product';

  const response = await fetch(url);
  const stockLevels = await response.json();

  if (!stockLevels.length) {
    return [];
  }

  const today = new Date();
  const agingReport = stockLevels
    .filter(s => s.quantity > 0 && s.product.createdAt)
    .map(stock => {
      const createdAt = new Date(stock.product.createdAt);
      const ageInDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));
      return {
        ...stock.product, // return product info
        stockId: stock.id,
        quantity: stock.quantity, // with the current quantity
        locationId: stock.locationId,
        ageInDays,
      };
    })
    .sort((a, b) => b.ageInDays - a.ageInDays); // Sort by oldest first

  return agingReport;
};

export const getSupplierPerformance = async () => {
  const response = await fetch('/db.json');
  const data = await response.json();
  const { suppliers = [], orders = [], products = [] } = data;

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
