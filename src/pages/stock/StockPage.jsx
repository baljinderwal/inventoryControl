import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService'; // Use productService

import AppDialog from '../../components/ui/AppDialog';
import StockAdjustmentForm from './StockAdjustmentForm';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Row = ({ product, handleOpenModal }) => {
  const [open, setOpen] = useState(false);
  const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
  const lowStock = totalStock < product.lowStockThreshold;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{product.name}</TableCell>
        <TableCell>{product.sku}</TableCell>
        <TableCell align="right">{totalStock}</TableCell>
        <TableCell>
          <Chip
            label={lowStock ? 'Low Stock' : 'In Stock'}
            color={lowStock ? 'error' : 'success'}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Button variant="outlined" size="small" onClick={() => handleOpenModal(product)}>
            Adjust Stock
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Batches
              </Typography>
              <Table size="small" aria-label="batches">
                <TableHead>
                  <TableRow>
                    <TableCell>Batch Number</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.batches.length > 0 ? (
                    product.batches.map((batch) => (
                      <TableRow key={batch.batchNumber}>
                        <TableCell component="th" scope="row">{batch.batchNumber}</TableCell>
                        <TableCell>{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{batch.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No batches for this product.</TableCell>
                    </TableRow>
                  )}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts, // Use getProducts to get full product objects
  });

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching stock levels: {error.message}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Stock Management
      </Typography>

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
              <Row key={product.id} product={product} handleOpenModal={handleOpenModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedProduct && (
        <AppDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Adjust Stock for ${selectedProduct.name}`}
        >
          <StockAdjustmentForm onClose={handleCloseModal} product={selectedProduct} />
        </AppDialog>
      )}
    </div>
  );
};

export default StockPage;
