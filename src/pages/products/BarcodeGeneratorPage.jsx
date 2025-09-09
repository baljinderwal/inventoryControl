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
  CircularProgress,
  TextField
} from '@mui/material';
import Barcode from 'react-barcode';
import { productService } from '../../services/productService';

const BarcodeGeneratorPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copyCount, setCopyCount] = useState(1);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
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
      <Typography variant="h4" gutterBottom className="no-print" sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 3 }}>
        Barcode Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }} className="no-print">
        Generate and print barcodes for your products
      </Typography>
      <Paper sx={{ 
        p: 3, 
        maxWidth: 450, 
        margin: '0 auto',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }} className="no-print">
        <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
          <InputLabel id="product-select-label">Select Product</InputLabel>
          <Select
            labelId="product-select-label"
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={handleProductChange}
            disabled={isLoading || isError}
            label="Select Product"
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
            sx={{ 
              mt: 3,
              py: 1.5,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              }
            }}
            className="no-print"
          >
            Print Barcodes
          </Button>
          <TextField
            label="Number of Copies"
            type="number"
            variant="outlined"
            value={copyCount}
            onChange={(e) => setCopyCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ 
              mt: 2, 
              display: 'block',
              maxWidth: 200,
              margin: '16px auto 0'
            }}
            className="no-print"
          />
        </Box>
      )}
    </Box>
  );
};

export default BarcodeGeneratorPage;
