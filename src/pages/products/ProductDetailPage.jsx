import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';

import AppDialog from '../../components/ui/AppDialog';
import AddEditProductForm from './AddEditProductForm';


const ProductDetailPage = () => {
  const { id } = useParams();
  const { mode, services } = useApi();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id, mode],
    queryFn: () => services.stock.getProductWithStock(parseInt(id, 10)),
    enabled: !!id,
  });

  const handleEditClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching product details: {error.message}</Alert>;
  }

  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

  const allBatches = product.stockByLocation.flatMap(loc =>
    loc.batches.map(batch => ({
      ...batch,
      locationName: loc.locationName,
    }))
  );

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/products">
          Products
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">{product.name}</Typography>
        <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Image and Details */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={product.imageUrl || 'https://via.placeholder.com/300'}
              alt={product.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h6">Details</Typography>
              <Typography variant="body2" color="text.secondary"><strong>SKU:</strong> {product.sku}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Barcode:</strong> {product.barcode}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Category:</strong> {product.category}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Price:</strong> ${product.price?.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Cost Price:</strong> ${product.costPrice?.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Low Stock Threshold:</strong> {product.lowStockThreshold}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Stock / Component Information */}
        <Grid item xs={12} md={8}>
          {product.type === 'bundle' ? (
            <>
              <Typography variant="h6" gutterBottom>Bundle Components</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Component Name</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell align="right">Required Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.components.map((c, index) => (
                      <TableRow key={index}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.sku}</TableCell>
                        <TableCell align="right">{c.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>Stock Levels by Location</Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.stockByLocation && product.stockByLocation.length > 0 ? (
                      product.stockByLocation.map((loc) => (
                        <TableRow key={loc.locationId}>
                          <TableCell>{loc.locationName}</TableCell>
                          <TableCell align="right">{loc.quantity}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>No stock information available.</TableCell>
                      </TableRow>
                    )}
                    <TableRow sx={{ '& td': { borderTop: '2px solid rgba(224, 224, 224, 1)' } }}>
                      <TableCell><strong>Total Stock</strong></TableCell>
                      <TableCell align="right"><strong>{product.stock}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom>Batch Details</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell>Batch Number</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allBatches.length > 0 ? (
                      allBatches.map((batch, index) => {
                        const isExpired = new Date(batch.expiryDate) < new Date();
                        return (
                          <TableRow key={index} sx={{ backgroundColor: isExpired ? 'rgba(255, 0, 0, 0.1)' : 'inherit' }}>
                            <TableCell>{batch.locationName}</TableCell>
                            <TableCell>{batch.batchNumber}</TableCell>
                            <TableCell>{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
                            <TableCell align="right">{batch.quantity}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>No batch information available.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Grid>
      </Grid>

      <AppDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        title="Edit Product"
      >
        <AddEditProductForm onClose={handleCloseForm} product={product} />
      </AppDialog>
    </div>
  );
};

export default ProductDetailPage;
