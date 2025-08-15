import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';

import StatsCard from '../../components/ui/StatsCard';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

const chartData = [
  { name: 'Jan', Sales: 4000, Stock: 2400 },
  { name: 'Feb', Sales: 3000, Stock: 1398 },
  { name: 'Mar', Sales: 2000, Stock: 9800 },
  { name: 'Apr', Sales: 2780, Stock: 3908 },
  { name: 'May', Sales: 1890, Stock: 4800 },
  { name: 'Jun', Sales: 2390, Stock: 3800 },
];

const DashboardPage = () => {
  const { mode, services } = useApi();

  // Fetch stock levels which include product data
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['stock', mode],
    queryFn: services.stock.getStockLevels,
  });

  const lowStockProducts = products?.filter(p => p.stock <= p.lowStockThreshold) || [];

  const stats = [
    { name: 'Total Products', stat: products?.length || 0, icon: <InventoryIcon /> },
    { name: 'Total Orders', stat: '2,310', icon: <ShoppingCartIcon /> }, // This is still hardcoded
    { name: 'Low Stock', stat: lowStockProducts.length, icon: <WarningIcon /> },
    { name: 'Revenue', stat: '$405,091', icon: <AttachMoneyIcon /> }, // This is still hardcoded
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.name}>
            <StatsCard title={item.name} value={item.stat} icon={item.icon} />
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
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
              Inventory Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Stock" fill="#8884d8" />
                <Bar dataKey="Sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
};

export default DashboardPage;
