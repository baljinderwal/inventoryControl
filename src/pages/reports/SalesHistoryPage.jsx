import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfitabilityReportData } from '../../services/reportService';
import { Paper, Typography, Box, CircularProgress, Alert, Grid, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const SalesHistoryPage = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // Default to last month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['salesHistoryReportData'], // Use a unique key
    queryFn: getProfitabilityReportData, // Re-use the same data fetching function
  });

  const salesData = useMemo(() => {
    if (!data) return null;

    const { products, orders } = data;
    const productsMap = new Map(products.map(p => [p.id, p]));
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const dailySales = {};

    orders.forEach(order => {
      if (order.status !== 'Completed' || !order.completedAt) {
        return;
      }

      const completedDate = parseISO(order.completedAt);
      if (completedDate < start || completedDate > end) {
        return;
      }

      const day = format(completedDate, 'yyyy-MM-dd');
      const revenue = order.products.reduce((sum, item) => {
        const product = productsMap.get(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      if (!dailySales[day]) {
        dailySales[day] = { date: day, revenue: 0 };
      }
      dailySales[day].revenue += revenue;
    });

    return Object.values(dailySales).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, startDate, endDate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching report data: {error.message}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales History Report
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {salesData && salesData.length > 0 ? (
        <Paper sx={{ p: 2, height: 400 }}>
           <Typography variant="h6">Revenue Over Time</Typography>
          <ResponsiveContainer>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(parseISO(date), 'MMM d')} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Daily Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      ) : (
        <Alert severity="info">No sales data available for the selected period.</Alert>
      )}
    </Box>
  );
};

export default SalesHistoryPage;
