import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

const LowStockWidget = () => {
  const { mode, services } = useApi();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['stock', mode],
    queryFn: services.stock.getStockLevels,
  });

  const lowStockProducts = products?.filter(p => p.stock <= p.lowStockThreshold) || [];

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
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
  );
};

export default LowStockWidget;
