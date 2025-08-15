import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

const TopCustomersWidget = () => {
  const { mode, services } = useApi();

  const { data: salesOrders = [], isLoading, isError } = useQuery({
    queryKey: ['salesOrders', mode],
    queryFn: () => services.salesOrders.getSalesOrders(),
  });

  const topCustomers = useMemo(() => {
    if (!salesOrders) return [];
    const customerSales = salesOrders.reduce((acc, order) => {
      if (order.status === 'Completed') {
        if (!acc[order.customerName]) {
          acc[order.customerName] = 0;
        }
        acc[order.customerName] += order.total;
      }
      return acc;
    }, {});

    return Object.entries(customerSales)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [salesOrders]);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Top 5 Customers
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Error fetching sales data.</Typography>
      ) : topCustomers.length > 0 ? (
        <List>
          {topCustomers.map((customer) => (
            <ListItem key={customer.name} secondaryAction={<Chip label={`$${customer.total.toFixed(2)}`} />}>
              <ListItemText primary={customer.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No sales data available.</Typography>
      )}
    </Paper>
  );
};

export default TopCustomersWidget;
