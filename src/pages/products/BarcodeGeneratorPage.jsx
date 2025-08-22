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
  const [copyCount, setCopyCount] = useState(1);

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
        '.print-only': {
          display: 'none',
        },
        '@media print': {
          '.no-print': {
            display: 'none',
          },
          '.print-only': {
            display: 'block',
          },
          'body, html': {
            visibility: 'hidden',
          },
          '.printable-area, .printable-area *': {
            visibility: 'visible',
          },
          '.printable-area': {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
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
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {/* On-screen preview */}
          <Box className="no-print">
            <Typography variant="h6">{selectedProduct.name}</Typography>
            <Barcode value={selectedProduct.barcode} />
          </Box>

          {/* Print-only area */}
          <Box className="print-only printable-area">
            {Array.from({ length: copyCount }).map((_, index) => (
              <Barcode key={index} value={selectedProduct.barcode} />
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{ mt: 2 }}
            className="no-print"
          >
            Print Barcodes
          </Button>
          <TextField
            label="Number of Copies"
            type="number"
            value={copyCount}
            onChange={(e) => setCopyCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ mt: 2, display: 'block' }}
            className="no-print"
          />
        </Box>
      )}
    </Box>
  );
};

export default BarcodeGeneratorPage;
