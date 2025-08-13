import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPurchaseOrders } from '../../services/purchaseOrderService';
import { getSuppliers } from '../../services/supplierService';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState({});

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      const orders = await getPurchaseOrders();
      setPurchaseOrders(orders);
    };

    const fetchSuppliers = async () => {
      const supplierData = await getSuppliers();
      const supplierMap = supplierData.reduce((acc, supplier) => {
        acc[supplier.id] = supplier.name;
        return acc;
      }, {});
      setSuppliers(supplierMap);
    };

    fetchPurchaseOrders();
    fetchSuppliers();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Purchase Orders
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/purchase-orders/new"
        sx={{ mb: 2 }}
      >
        Create Purchase Order
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{suppliers[order.supplierId] || 'Loading...'}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/purchase-orders/edit/${order.id}`}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PurchaseOrdersPage;
