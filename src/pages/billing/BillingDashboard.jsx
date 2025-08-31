import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonetizationOn, Warning } from '@mui/icons-material';
import StatsCard from '../../components/ui/StatsCard';

const BillingDashboard = ({ invoices = [] }) => {
  // Calculate metrics from props
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((acc, inv) => acc + inv.total, 0);

  const revenueThisMonth = invoices
    .filter(inv => {
      const paidDate = new Date(inv.invoiceDate); // Assuming invoiceDate is when it's "paid" for this metric
      return inv.status === 'Paid' && paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
    })
    .reduce((acc, inv) => acc + inv.total, 0);

  const overdueInvoices = invoices.filter(inv => new Date(inv.dueDate) < now && inv.status !== 'Paid').length;

  // Prepare data for the chart (revenue by month for the last 6 months)
  const monthlyRevenue = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthlyRevenue[monthName] = 0;
  }

  invoices.forEach(inv => {
    if (inv.status === 'Paid') {
      const invoiceDate = new Date(inv.invoiceDate);
      const monthName = invoiceDate.toLocaleString('default', { month: 'short' });
      if (monthlyRevenue.hasOwnProperty(monthName)) {
        monthlyRevenue[monthName] += inv.total;
      }
    }
  });

  const chartData = Object.keys(monthlyRevenue).map(month => ({
    name: month,
    Revenue: monthlyRevenue[month],
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Outstanding"
            value={`$${totalOutstanding.toFixed(2)}`}
            icon={<MonetizationOn sx={{ fontSize: 40 }} color="warning" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Revenue This Month"
            value={`$${revenueThisMonth.toFixed(2)}`}
            icon={<MonetizationOn sx={{ fontSize: 40 }} color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Overdue Invoices"
            value={overdueInvoices}
            icon={<Warning sx={{ fontSize: 40 }} color="error" />}
          />
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="Revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillingDashboard;
