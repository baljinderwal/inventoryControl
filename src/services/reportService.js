import api from './api';

const getLocalData = async () => {
  const response = await fetch('/db.json');
  return await response.json();
};

const local = {
  getProfitabilityReportData: async () => {
    const data = await getLocalData();
    const products = data.products || [];
    const orders = (data.orders || []).filter(o => o.status === 'Completed');
    return { products, orders };
  },
  getSalesHistory: async () => {
    const data = await getLocalData();
    const products = data.products || [];
    const orders = (data.orders || []).filter(o => o.status === 'Completed');
    if (!products.length || !orders.length) return [];
    const productMap = new Map(products.map(p => [p.id, p]));
    return orders.filter(o => o.completedAt).flatMap(o => o.products.map(item => {
      const p = productMap.get(item.productId);
      return { ...item, completedAt: new Date(o.completedAt), productName: p?.name, price: p?.price, totalSale: p ? item.quantity * p.price : 0 };
    })).sort((a, b) => b.completedAt - a.completedAt);
  },
  getInventoryAging: async () => {
    const data = await getLocalData();
    const products = data.products || [];
    const stock = data.stock || [];
    if (!products.length) return [];
    const stockMap = new Map(stock.map(s => [s.productId, s.quantity]));
    const today = new Date();
    return products.map(p => ({ ...p, stock: stockMap.get(p.id) || 0 })).filter(p => p.stock > 0 && p.createdAt).map(p => ({ ...p, ageInDays: Math.floor((today - new Date(p.createdAt)) / 864e5) })).sort((a, b) => b.ageInDays - a.ageInDays);
  },
  getSupplierPerformance: async () => {
    const data = await getLocalData();
    const suppliers = data.suppliers || [];
    const orders = data.orders || [];
    const products = data.products || [];
    if (!suppliers.length || !orders.length) return [];
    const productMap = new Map(products.map(p => [p.id, p]));
    return suppliers.map(s => {
      const sOrders = orders.filter(o => o.supplier.id === s.id);
      const totalValue = sOrders.reduce((sum, order) => sum + order.products.reduce((orderSum, i) => orderSum + (productMap.get(i.productId)?.price || 0) * i.quantity, 0), 0);
      return { ...s, totalOrders: sOrders.length, completedOrders: sOrders.filter(o => o.status === 'Completed').length, pendingOrders: sOrders.filter(o => o.status !== 'Completed').length, totalValue };
    });
  },
};

const remote = {
  getProfitabilityReportData: async () => {
    const [pRes, oRes] = await Promise.all([api.get('/products'), api.get('/orders?status=Completed')]);
    return { products: pRes.data, orders: oRes.data };
  },
  getSalesHistory: async () => {
    const [pRes, oRes] = await Promise.all([api.get('/products'), api.get('/orders?status=Completed')]);
    const products = pRes.data, orders = oRes.data;
    if (!products.length || !orders.length) return [];
    const productMap = new Map(products.map(p => [p.id, p]));
    return orders.filter(o => o.completedAt).flatMap(o => o.products.map(item => {
      const p = productMap.get(item.productId);
      return { ...item, completedAt: new Date(o.completedAt), productName: p?.name, price: p?.price, totalSale: p ? item.quantity * p.price : 0 };
    })).sort((a, b) => b.completedAt - a.completedAt);
  },
  getInventoryAging: async () => {
    const [pRes, sRes] = await Promise.all([api.get('/products'), api.get('/stock')]);
    const products = pRes.data, stock = sRes.data;
    if (!products.length) return [];
    const stockMap = new Map(stock.map(s => [s.productId, s.quantity]));
    const today = new Date();
    return products.map(p => ({ ...p, stock: stockMap.get(p.id) || 0 })).filter(p => p.stock > 0 && p.createdAt).map(p => ({ ...p, ageInDays: Math.floor((today - new Date(p.createdAt)) / 864e5) })).sort((a, b) => b.ageInDays - a.ageInDays);
  },
  getSupplierPerformance: async () => {
    const [supRes, oRes, pRes] = await Promise.all([api.get('/suppliers'), api.get('/orders'), api.get('/products')]);
    const suppliers = supRes.data, orders = oRes.data, products = pRes.data;
    if (!suppliers.length || !orders.length) return [];
    const productMap = new Map(products.map(p => [p.id, p]));
    return suppliers.map(s => {
      const sOrders = orders.filter(o => o.supplier.id === s.id);
      const totalValue = sOrders.reduce((sum, order) => sum + order.products.reduce((orderSum, i) => orderSum + (productMap.get(i.productId)?.price || 0) * i.quantity, 0), 0);
      return { ...s, totalOrders: sOrders.length, completedOrders: sOrders.filter(o => o.status === 'Completed').length, pendingOrders: sOrders.filter(o => o.status !== 'Completed').length, totalValue };
    });
  },
};


export const reportService = { local, api: remote };
