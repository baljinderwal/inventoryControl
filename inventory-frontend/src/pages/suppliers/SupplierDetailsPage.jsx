import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSupplier } from '../../services/supplierService';
import { getPurchaseOrders } from '../../services/purchaseOrderService';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const SupplierDetailsPage = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierData = await getSupplier(id);
      setSupplier(supplierData);

      const allPurchaseOrders = await getPurchaseOrders();
      const supplierPurchaseOrders = allPurchaseOrders.filter(
        (order) => order.supplierId === parseInt(id)
      );
      setPurchaseOrders(supplierPurchaseOrders);
    };

    fetchSupplierDetails();
  }, [id]);

  if (!supplier) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {supplier.name}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Purchase Order History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SupplierDetailsPage;
