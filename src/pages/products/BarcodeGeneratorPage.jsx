import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import Barcode from 'react-barcode';
import { useApi } from '../../utils/ApiModeContext';

const BarcodeGeneratorPage = () => {
  const { mode, services } = useApi();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products', mode],
    queryFn: () => services.products.getProducts(),
  });

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        p: 3,
        '@media print': {
          '& .no-print': {
            display: 'none',
          },
          '& .printable-area': {
            margin: '0',
            padding: '0',
            boxShadow: 'none',
          },
          'body': {
            margin: '1in', // Example margin
          }
        },
      }}
    >
      <Typography variant="h4" gutterBottom className="no-print">
        Barcode Generator
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 400, margin: '0 auto' }} className="no-print">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="product-select-label">Select Product</InputLabel>
          <Select
            labelId="product-select-label"
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={handleProductChange}
            disabled={isLoading || isError}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {products && products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isLoading && <CircularProgress />}
        {isError && <Typography color="error">Error fetching products: {error.message}</Typography>}
      </Paper>

      {selectedProduct && (
        <Box sx={{ mt: 3, textAlign: 'center' }} className="printable-area">
          <Typography variant="h6">{selectedProduct.name}</Typography>
          <Barcode value={selectedProduct.barcode} />
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{ mt: 2 }}
            className="no-print"
          >
            Print Barcode
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BarcodeGeneratorPage;
