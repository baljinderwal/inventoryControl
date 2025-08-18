import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useApi } from '../../utils/ApiModeContext';
import { useNotificationCenter } from '../../utils/NotificationCenterContext';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const DashboardPage = () => {
  const { mode, services } = useApi();
  const { addNotification, notifications } = useNotificationCenter();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['stock', mode],
    queryFn: services.stock.getStockLevels,
  });

  const lowStockProducts = useMemo(() => {
    return products?.filter(p => p.stock <= p.lowStockThreshold) || [];
  }, [products]);

  useEffect(() => {
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        const notificationExists = notifications.some(
          n => n.type === 'LOW_STOCK' && n.refId === product.id
        );
        if (!notificationExists) {
          addNotification({
            message: `${product.name} is low on stock! Only ${product.stock} left.`,
            type: 'LOW_STOCK',
            refId: product.id
          });
        }
      });
    }
  }, [lowStockProducts, addNotification, notifications]);

  const stats = [
    { name: 'Total Products', stat: products?.length || 0, icon: <InventoryIcon /> },
    { name: 'Total Orders', stat: '2,310', icon: <ShoppingCartIcon /> },
    { name: 'Low Stock', stat: lowStockProducts.length, icon: <WarningIcon /> },
    { name: 'Revenue', stat: '$405,091', icon: <AttachMoneyIcon /> },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.name} component={motion.div} variants={itemVariants}>
            <StatsCard title={item.name} value={item.stat} icon={item.icon} />
          </Grid>
        ))}

        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 2, mt: 2, backgroundColor: 'background.paper' }}>
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

        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 2, mt: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Inventory Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="Stock" fill="#6366f1" />
                <Bar dataKey="Sales" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>
    </motion.div>
  );
};

export default DashboardPage;
