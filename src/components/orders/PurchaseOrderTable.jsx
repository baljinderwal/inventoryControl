import React from 'react';
import MuiTable from '../ui/Table';
import { Button, Chip, IconButton, Stack } from '@mui/material';
import { CheckCircle, Delete, Edit, PictureAsPdf } from '@mui/icons-material';

const PurchaseOrderTable = ({
  purchaseOrders,
  productsLoaded,
  productsData,
  onReceive,
  onEdit,
  onDelete,
  onGeneratePDF,
}) => {
  const tableHeaders = [
    { id: 'id', label: 'PO ID' },
    { id: 'supplier', label: 'Supplier' },
    { id: 'date', label: 'Date' },
    { id: 'totalValue', label: 'Total Value' },
    { id: 'status', label: 'Status' },
    { id: 'itemCount', label: 'Items' },
    { id: 'actions', label: 'Actions' },
  ];

  const tableData = purchaseOrders?.map((po) => {
    const totalValue = productsLoaded
      ? po.products.reduce((acc, item) => {
          const product = productsData.find((p) => p.id === item.productId);
          return acc + (product?.price || 0) * item.quantity;
        }, 0)
      : 0;

    return {
      id: po.id,
      supplier: po.supplier?.name || 'N/A',
      date: new Date(po.createdAt).toLocaleDateString(),
      totalValue: `$${totalValue.toFixed(2)}`,
      status: (
        <Chip
          label={po.status}
          color={po.status === 'Completed' ? 'success' : 'warning'}
          size="small"
        />
      ),
      itemCount: po.products.length,
      actions: (
        <Stack direction="row" spacing={1}>
          {po.status === 'Pending' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              onClick={() => onReceive(po)}
            >
              Receive
            </Button>
          )}
          <IconButton
            size="small"
            onClick={() => onEdit(po)}
            disabled={po.status === 'Completed'}
          >
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(po)}
            color="error"
          >
            <Delete fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onGeneratePDF(po)}
            color="primary"
          >
            <PictureAsPdf fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    };
  });

  return <MuiTable headers={tableHeaders} data={tableData || []} />;
};

export default PurchaseOrderTable;
