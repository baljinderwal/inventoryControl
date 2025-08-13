import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import { getSales } from '../../services/salesService';

import StatsCard from '../../components/ui/StatsCard';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

const DashboardPage = () => {
  const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: sales, isLoading: isLoadingSales, error: errorSales } = useQuery({
    queryKey: ['sales'],
    queryFn: getSales,
  });

  const lowStockProducts = products?.filter(p => p.stock <= p.lowStockThreshold) || [];

  const totalSales = sales?.length || 0;
  const totalRevenue = sales?.reduce((acc, sale) => acc + sale.totalRevenue, 0) || 0;

  const stats = [
    { name: 'Total Products', stat: products?.length || 0, icon: <InventoryIcon />, isLoading: isLoadingProducts },
    { name: 'Total Sales', stat: totalSales, icon: <ShoppingCartIcon />, isLoading: isLoadingSales },
    { name: 'Low Stock', stat: lowStockProducts.length, icon: <WarningIcon />, isLoading: isLoadingProducts },
    { name: 'Revenue', stat: `$${totalRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, isLoading: isLoadingSales },
  ];

  const salesDataForChart = (sales || []).reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    const year = new Date(sale.date).getFullYear();
    const monthYear = `${month} ${year}`;

    const existingMonth = acc.find(item => item.name === monthYear);

    if (existingMonth) {
      existingMonth.Revenue += sale.totalRevenue;
    } else {
      acc.push({ name: monthYear, Revenue: sale.totalRevenue });
    }
    return acc;
  }, []).sort((a, b) => {
    const dateA = new Date(`01 ${a.name}`);
    const dateB = new Date(`01 ${b.name}`);
    return dateA - dateB;
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.name}>
            <StatsCard title={item.name} value={item.isLoading ? <CircularProgress size={24} /> : item.stat} icon={item.icon} />
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            {isLoadingProducts ? (
              <CircularProgress />
            ) : errorProducts ? (
              <Typography color="error">Error fetching products.</Typography>
            ) : lowStockProducts.length > 0 ? (
              <List>
                {lowStockProducts.map((product) => (
                  <ListItem key={product.id}>
                    <ListItemText
                      primary={product.name}
                      secondary={`Current Stock: ${product.stock} | Threshold: ${product.lowStockThreshold}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No products are currently low on stock. Great job!</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Trends
            </Typography>
            {isLoadingSales ? (
              <CircularProgress />
            ) : errorSales ? (
                <Typography color="error">Error fetching sales data.</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesDataForChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
};

export default DashboardPage;
