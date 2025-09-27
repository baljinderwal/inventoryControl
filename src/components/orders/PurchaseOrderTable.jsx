import React from 'react';
import MuiTable from '../ui/Table';
import { Button, Chip, IconButton, Stack } from '@mui/material';
import { CheckCircle, Delete, Edit, PictureAsPdf } from '@mui/icons-material';

/**
 * Renders a table of purchase orders.
 * @param {object} props - The component props.
 * @param {Array} props.purchaseOrders - The list of purchase orders to display.
 * @param {boolean} props.productsLoaded - Whether the product data has been loaded.
 * @param {Array} props.productsData - The list of all products.
 * @param {function} props.onReceive - The function to call when the receive button is clicked.
 * @param {function} props.onEdit - The function to call when the edit button is clicked.
 * @param {function} props.onDelete - The function to call when the delete button is clicked.
 * @param {function} props.onGeneratePDF - The function to call when the generate PDF button is clicked.
 */
const PurchaseOrderTable = ({
  purchaseOrders,
  productsLoaded,
  productsData,
  onReceive,
  onEdit,
  onDelete,
  onGeneratePDF,
}) => {
  // Define the headers for the table
  const tableHeaders = [
    { id: 'id', label: 'PO ID' },
    { id: 'supplier', label: 'Supplier' },
    { id: 'date', label: 'Date' },
    { id: 'totalValue', label: 'Total Value' },
    { id: 'status', label: 'Status' },
    { id: 'itemCount', label: 'Items' },
    { id: 'actions', label: 'Actions' },
  ];

  // Transform the purchase order data into a format that can be displayed by the table
  const tableData = purchaseOrders?.map((po) => {
    // Calculate the total value of the purchase order
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
