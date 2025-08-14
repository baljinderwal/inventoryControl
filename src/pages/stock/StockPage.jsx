import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getStockLevels } from '../../services/stockService';

import AppDialog from '../../components/ui/AppDialog';
import StockAdjustmentForm from './StockAdjustmentForm';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';

const ProductRow = ({ product, stockData }) => {
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalStock = stockData.reduce((acc, s) => acc + s.quantity, 0);
  const lowStockThreshold = product.lowStockThreshold || 0;

  const handleOpenModal = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
    setIsModalOpen(false);
  };

  return (
    <>
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
            label={totalStock < lowStockThreshold ? 'Low Stock' : 'In Stock'}
            color={totalStock < lowStockThreshold ? 'error' : 'success'}
            size="small"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Stock by Location
              </Typography>
              <Table size="small" aria-label="locations">
                <TableHead>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockData.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.location.name}</TableCell>
                      <TableCell>{stock.location.address}</TableCell>
                      <TableCell align="right">{stock.quantity}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" onClick={() => handleOpenModal(stock)}>
                          Adjust Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {selectedStock && (
        <AppDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Adjust Stock for ${product.name} at ${selectedStock.location.name}`}
        >
          <StockAdjustmentForm onClose={handleCloseModal} stock={selectedStock} />
        </AppDialog>
      )}
    </>
  );
};

const StockPage = () => {
  const navigate = useNavigate();
  const { data: stockLevels = [], isLoading, isError, error } = useQuery({
    queryKey: ['stockLevels'],
    queryFn: getStockLevels,
  });

  const productsWithStock = useMemo(() => {
    const grouped = stockLevels.reduce((acc, stock) => {
      const productId = stock.product.id;
      if (!acc[productId]) {
        acc[productId] = {
          product: stock.product,
          stockData: [],
        };
      }
      acc[productId].stockData.push(stock);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [stockLevels]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching stock levels: {error.message}</Alert>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Stock Management
        </Typography>
        <Button variant="contained" onClick={() => navigate('/stock/transfer')}>
          Transfer Stock
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Total Quantity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsWithStock.map(({ product, stockData }) => (
              <ProductRow key={product.id} product={product} stockData={stockData} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockPage;
