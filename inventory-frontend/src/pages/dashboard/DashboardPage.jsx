import React from 'react';
import StatsCard from '../../components/ui/StatsCard';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const stats = [
  { name: 'Total Products', stat: '71,897', icon: <InventoryIcon /> },
  { name: 'Total Orders', stat: '2,310', icon: <ShoppingCartIcon /> },
  { name: 'Low Stock', stat: '12', icon: <WarningIcon /> },
  { name: 'Revenue', stat: '$405,091', icon: <AttachMoneyIcon /> },
];

const chartData = [
  { name: 'Jan', Sales: 4000, Stock: 2400 },
  { name: 'Feb', Sales: 3000, Stock: 1398 },
  { name: 'Mar', Sales: 2000, Stock: 9800 },
  { name: 'Apr', Sales: 2780, Stock: 3908 },
  { name: 'May', Sales: 1890, Stock: 4800 },
  { name: 'Jun', Sales: 2390, Stock: 3800 },
];

const DashboardPage = () => {
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
        <Grid item xs={12}>
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
