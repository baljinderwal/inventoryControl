import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInventoryData } from '../../services/stockService';
import AppDialog from '../../components/ui/AppDialog';
import StockAdjustmentForm from './StockAdjustmentForm';
import StockTransferForm from './StockTransferForm'; // Import the new form

import {
  Box, Typography, CircularProgress, Alert, Button, Chip, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BatchTable = ({ batches }) => (
  <Table size="small" aria-label="batches">
    <TableHead>
      <TableRow>
        <TableCell>Batch Number</TableCell>
        <TableCell>Expiry Date</TableCell>
        <TableCell align="right">Quantity</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {batches.map((batch) => (
        <TableRow key={batch.id}>
          <TableCell>{batch.batchNumber}</TableCell>
          <TableCell>{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
          <TableCell align="right">{batch.quantity}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const LocationRow = ({ location, batches, onTransferClick }) => {
  const [open, setOpen] = useState(false);
  const totalStockAtLocation = batches.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell style={{ width: '50px' }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{location.name}</TableCell>
        <TableCell align="right">{totalStockAtLocation}</TableCell>
        <TableCell align="center" style={{ width: '120px' }}>
          <Button size="small" variant="text" onClick={onTransferClick}>
            Transfer
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, ml: 5 }}>
              <Typography variant="h6" gutterBottom component="div">Batches at {location.name}</Typography>
              <BatchTable batches={batches} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ProductRow = ({ product, locations, inventory, handleOpenModal, handleOpenTransferModal }) => {
  const [open, setOpen] = useState(false);

  const { stockByLocation, totalStock } = useMemo(() => {
    const productInventory = inventory.filter(item => item.productId === product.id);
    const total = productInventory.reduce((sum, item) => sum + item.quantity, 0);
    const byLocation = productInventory.reduce((acc, item) => {
      acc[item.locationId] = [...(acc[item.locationId] || []), item];
      return acc;
    }, {});
    return { stockByLocation: byLocation, totalStock: total };
  }, [inventory, product.id]);

  const lowStock = totalStock < product.lowStockThreshold;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)} disabled={Object.keys(stockByLocation).length === 0}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.sku}</TableCell>
        <TableCell align="right">{totalStock}</TableCell>
        <TableCell><Chip label={lowStock ? 'Low Stock' : 'In Stock'} color={lowStock ? 'error' : 'success'} size="small" /></TableCell>
        <TableCell>
          <Button variant="outlined" size="small" onClick={() => handleOpenModal(product, inventory, totalStock)}>
            Adjust Stock
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Stock by Location</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Sub-total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(stockByLocation).map(([locationId, batches]) => {
                    const location = locations.find(l => l.id === parseInt(locationId));
                    return location ? (
                      <LocationRow
                        key={locationId}
                        location={location}
                        batches={batches}
                        onTransferClick={() => handleOpenTransferModal(product, location, locations, inventory)}
                      />
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const StockPage = () => {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['inventoryData'],
    queryFn: getInventoryData,
  });

  const handleOpenAdjustModal = (product, inventory, totalStock) => {
    setModalProps({ product, inventory, totalStock });
    setIsAdjustModalOpen(true);
  };

  const handleOpenTransferModal = (product, fromLocation, locations, inventory) => {
    setModalProps({ product, fromLocation, locations, inventory });
    setIsTransferModalOpen(true);
  };

  const handleClose = () => {
    setIsAdjustModalOpen(false);
    setIsTransferModalOpen(false);
    setModalProps({});
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching stock data: {error.message}</Alert>;

  const { products = [], locations = [], inventoryBatches = [] } = data || {};

  return (
    <div>
      <Typography variant="h4" gutterBottom>Stock Management</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                locations={locations}
                inventory={inventoryBatches}
                handleOpenModal={handleOpenAdjustModal}
                handleOpenTransferModal={handleOpenTransferModal}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isAdjustModalOpen && (
        <AppDialog isOpen={isAdjustModalOpen} onClose={handleClose} title={`Adjust Stock for ${modalProps.product?.name}`}>
          <StockAdjustmentForm onClose={handleClose} {...modalProps} />
        </AppDialog>
      )}

      {isTransferModalOpen && (
        <AppDialog isOpen={isTransferModalOpen} onClose={handleClose} title={`Transfer Stock for ${modalProps.product?.name}`}>
          <StockTransferForm onClose={handleClose} {...modalProps} />
        </AppDialog>
      )}
    </div>
  );
};

export default StockPage;
