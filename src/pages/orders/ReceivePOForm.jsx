import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { poService } from '../../services/poService';
import AppDialog from '../../components/ui/AppDialog';

import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const ReceivePOForm = ({ open, onClose, po }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [batchNumber, setBatchNumber] = useState('');
  const [productEntries, setProductEntries] = useState([]);

  useEffect(() => {
    if (po) {
      // Generate a single batch number for the entire PO
      setBatchNumber(`B-${Date.now()}`);

      // Initialize product entries with default expiry dates
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const defaultExpiryDate = nextYear.toISOString().split('T')[0];

      setProductEntries(po.products.map(item => ({
        ...item,
        expiryDate: defaultExpiryDate
      })));
    }
  }, [po]);

  const handleExpiryDateChange = (productId, value) => {
    setProductEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.productId === productId ? { ...entry, expiryDate: value } : entry
      )
    );
  };

  const mutation = useMutation({
    mutationFn: (data) => poService.receivePO(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      showNotification('Purchase Order received successfully!', 'success');
      onClose();
    },
    onError: (err) => {
      showNotification(`Error receiving PO: ${err.message}`, 'error');
    }
  });

  const handleSubmit = () => {
    const data = {
      poId: po.id,
      batchNumber,
      products: productEntries.map(({ productId, quantity, expiryDate }) => ({
        productId,
        quantity,
        expiryDate
      }))
    };
    mutation.mutate(data);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={`Receive Purchase Order #${po?.id}`}
      fullWidth
      maxWidth="md"
    >
      <Box sx={{ p: 2 }}>
        <TextField
          label="Batch Number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Products</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Expiry Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productEntries.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productName || item.productId}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) => handleExpiryDateChange(item.productId, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isLoading}>
          {mutation.isLoading ? <CircularProgress size={24} /> : 'Receive Stock'}
        </Button>
      </DialogActions>
    </AppDialog>
  );
};

export default ReceivePOForm;
