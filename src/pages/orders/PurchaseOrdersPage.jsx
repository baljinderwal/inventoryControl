import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';
import { Parser } from '@json2csv/plainjs';
import { poService } from '../../services/poService';
import { stockService } from '../../services/stockService';
import { supplierService } from '../../services/supplierService';
import { Box, Typography, CircularProgress } from '@mui/material';
import { generatePOPDF } from '../../utils/generatePOPDF';
import AddEditPOForm from './AddEditPOForm';
import ReceivePOForm from './ReceivePOForm';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import PurchaseOrderActions from '../../components/orders/PurchaseOrderActions';
import PurchaseOrderTable from '../../components/orders/PurchaseOrderTable';

/**
 * The main page for managing purchase orders.
 * It serves as a container component that fetches data and manages state,
 * passing props to its children components.
 */
const PurchaseOrdersPage = () => {
  // State for controlling the visibility of the Add/Edit PO form
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State for controlling the visibility of the Receive PO form
  const [isReceiveFormOpen, setIsReceiveFormOpen] = useState(false);
  // State for the currently selected PO for editing or receiving
  const [selectedPO, setSelectedPO] = useState(null);
  // State for controlling the visibility of the delete confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // State for the PO that is about to be deleted
  const [poToDelete, setPOToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  // Fetch all purchase orders
  const { data: purchaseOrders, isLoading, isError, error } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: poService.getPOs,
  });

  // Note: We are using getStockLevels to get product data with stock info
  const { data: productsData, isSuccess: productsLoaded } = useQuery({
    queryKey: ['stock'],
    queryFn: stockService.getStockLevels,
  });

  // Fetch all suppliers
  const { data: suppliersData, isSuccess: suppliersLoaded } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
  });

  /**
   * Handles the generation of a PDF for a purchase order.
   * @param {object} po - The purchase order to generate a PDF for.
   */
  const handleGeneratePDF = (po) => {
    if (productsLoaded && suppliersLoaded) {
      generatePOPDF(po, productsData, suppliersData);
    } else {
      showNotification('Data is not ready yet, please try again in a moment.', 'info');
    }
  };

  /**
   * Opens the receive form for a purchase order.
   * Enriches the PO with product names before opening the form.
   * @param {object} po - The purchase order to receive.
   */
  const handleOpenReceiveForm = (po) => {
    // We need to enrich the PO products with the product name for the form
    const enrichedPO = {
      ...po,
      products: po.products.map(item => {
        const product = productsData.find(p => p.id === item.productId);
        // Important: We preserve the 'sizes' array from the PO item itself,
        // as it contains the quantities for this specific order.
        return {
          ...item,
          productName: product?.name || 'Unknown Product'
        };
      })
    };
    setSelectedPO(enrichedPO);
    setIsReceiveFormOpen(true);
  };

  /**
   * Closes the receive form.
   */
  const handleCloseReceiveForm = () => {
    setSelectedPO(null);
    setIsReceiveFormOpen(false);
  };

  // Mutation for deleting a purchase order
  const deletePOMutation = useMutation({
    mutationFn: poService.deletePO,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      showNotification('Purchase Order deleted successfully!', 'success');
    },
    onError: (err) => {
      showNotification(`Error deleting Purchase Order: ${err.message}`, 'error');
    },
    onSettled: () => {
      setIsConfirmOpen(false);
      setPOToDelete(null);
    }
  });

  /**
   * Opens the Add/Edit PO form.
   * @param {object | null} po - The purchase order to edit, or null to create a new one.
   */
  const handleOpenForm = (po = null) => {
    setSelectedPO(po);
    setIsFormOpen(true);
  };

  /**
   * Closes the Add/Edit PO form.
   */
  const handleCloseForm = () => {
    setSelectedPO(null);
    setIsFormOpen(false);
  };

  /**
   * Opens the delete confirmation dialog for a purchase order.
   * @param {object} po - The purchase order to delete.
   */
  const handleDeleteClick = (po) => {
    setPOToDelete(po);
    setIsConfirmOpen(true);
  };

  /**
   * Handles the export of purchase orders to a CSV file.
   */
  const handleExport = () => {
    if (!purchaseOrders || !productsLoaded) return;
    const exportData = purchaseOrders.map(po => {
      const totalValue = po.products.reduce((acc, item) => {
        const product = productsData.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
      }, 0);
      const productDetails = po.products.map(p => {
        const product = productsData.find(prod => prod.id === p.productId);
        return `${product?.name || 'N/A'} (Qty: ${p.quantity})`;
      }).join(', ');
      return { id: po.id, supplier: po.supplier?.name, createdAt: po.createdAt, completedAt: po.completedAt, status: po.status, itemCount: po.products.length, totalValue: totalValue.toFixed(2), products: productDetails };
    });
    const fields = ['id', 'supplier', 'createdAt', 'completedAt', 'status', 'itemCount', 'totalValue', 'products'];
    const parser = new Parser({ fields });
    const csv = parser.parse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'purchase_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Purchase Orders</Typography>
        <PurchaseOrderActions
          onExport={handleExport}
          onNewPO={() => handleOpenForm()}
          isExportDisabled={!purchaseOrders || purchaseOrders.length === 0}
        />
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Error fetching purchase orders: {error.message}</Typography>}
      {!isLoading && !isError && (
        <PurchaseOrderTable
          purchaseOrders={purchaseOrders}
          productsLoaded={productsLoaded}
          productsData={productsData}
          onReceive={handleOpenReceiveForm}
          onEdit={handleOpenForm}
          onDelete={handleDeleteClick}
          onGeneratePDF={handleGeneratePDF}
        />
      )}
      {isFormOpen && <AddEditPOForm open={isFormOpen} onClose={handleCloseForm} po={selectedPO} />}
      {isReceiveFormOpen && <ReceivePOForm open={isReceiveFormOpen} onClose={handleCloseReceiveForm} po={selectedPO} />}
      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deletePOMutation.mutate(poToDelete.id)}
        title="Delete Purchase Order"
        description={`Are you sure you want to delete Purchase Order #${poToDelete?.id}? This action cannot be undone.`}
        isLoading={deletePOMutation.isLoading}
      />
    </Box>
  );
};

export default PurchaseOrdersPage;
