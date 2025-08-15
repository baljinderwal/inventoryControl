import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

const RecentSalesWidget = () => {
  const { mode, services } = useApi();

  const { data: salesOrders = [], isLoading, isError } = useQuery({
    queryKey: ['salesOrders', mode],
    queryFn: () => services.salesOrders.getSalesOrders(),
  });

  const recentSales = salesOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Sales
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Error fetching sales orders.</Typography>
      ) : recentSales.length > 0 ? (
        <List>
          {recentSales.map((order) => (
            <ListItem key={order.id} secondaryAction={<Chip label={`$${order.total.toFixed(2)}`} />}>
              <ListItemText
                primary={`SO #${order.id} - ${order.customerName}`}
                secondary={new Date(order.createdAt).toLocaleDateString()}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No recent sales.</Typography>
      )}
    </Paper>
  );
};

export default RecentSalesWidget;
