import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfitabilityReportData } from '../../services/reportService';
import {
  Paper, Typography, Box, CircularProgress, Alert, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProfitabilityPage = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profitabilityReportData'],
    queryFn: getProfitabilityReportData,
  });

  const profitabilityData = useMemo(() => {
    if (!data) return null;

    const { products, orders } = data;
    const productsMap = new Map(products.map(p => [p.id, p]));

    const start = new Date(startDate);
    start.setHours(0,0,0,0);
    const end = new Date(endDate);
    end.setHours(23,59,59,999);

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });

    const productMetrics = {};

    filteredOrders.forEach(order => {
      const product = productsMap.get(order.productId);
      if (!product) return;

      const revenue = product.price * order.quantity;
      const cogs = product.costPrice * order.quantity;
      const grossProfit = revenue - cogs;

      if (!productMetrics[product.id]) {
        productMetrics[product.id] = {
          ...product,
          totalRevenue: 0,
          totalCogs: 0,
          totalGrossProfit: 0,
          totalQuantitySold: 0,
        };
      }

      productMetrics[product.id].totalRevenue += revenue;
      productMetrics[product.id].totalCogs += cogs;
      productMetrics[product.id].totalGrossProfit += grossProfit;
      productMetrics[product.id].totalQuantitySold += order.quantity;
    });

    const reportData = Object.values(productMetrics).map(p => ({
      ...p,
      profitMargin: p.totalRevenue > 0 ? (p.totalGrossProfit / p.totalRevenue) * 100 : 0,
    })).sort((a, b) => b.totalGrossProfit - a.totalGrossProfit);

    const totalRevenue = reportData.reduce((sum, p) => sum + p.totalRevenue, 0);
    const totalCogs = reportData.reduce((sum, p) => sum + p.totalCogs, 0);
    const totalGrossProfit = reportData.reduce((sum, p) => sum + p.totalGrossProfit, 0);

    const top5ProfitableProducts = reportData.slice(0, 5);

    const profitByCategory = reportData.reduce((acc, p) => {
      if (!acc[p.category]) {
        acc[p.category] = { name: p.category, value: 0 };
      }
      acc[p.category].value += p.totalGrossProfit;
      return acc;
    }, {});

    return {
      reportData,
      totalRevenue,
      totalCogs,
      totalGrossProfit,
      top5ProfitableProducts,
      profitByCategory: Object.values(profitByCategory),
    };
  }, [data, startDate, endDate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching report data: {error.message}</Alert>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profitability Report
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

      {profitabilityData && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>Total Revenue</Typography>
                  <Typography variant="h5">${profitabilityData.totalRevenue.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>Total COGS</Typography>
                  <Typography variant="h5">${profitabilityData.totalCogs.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>Total Gross Profit</Typography>
                  <Typography variant="h5" color="primary">${profitabilityData.totalGrossProfit.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6">Top 5 Most Profitable Products</Typography>
                <ResponsiveContainer>
                  <BarChart data={profitabilityData.top5ProfitableProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="totalGrossProfit" fill="#8884d8" name="Gross Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6">Profit by Category</Typography>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={profitabilityData.profitByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {profitabilityData.profitByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">COGS</TableCell>
                  <TableCell align="right">Gross Profit</TableCell>
                  <TableCell align="right">Profit Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profitabilityData.reportData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">{row.name}</TableCell>
                    <TableCell align="right">${row.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell align="right">${row.totalCogs.toFixed(2)}</TableCell>
                    <TableCell align="right">${row.totalGrossProfit.toFixed(2)}</TableCell>
                    <TableCell align="right">{row.profitMargin.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ProfitabilityPage;
