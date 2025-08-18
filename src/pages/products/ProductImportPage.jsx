import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { UploadFile as UploadFileIcon, Description as DescriptionIcon } from '@mui/icons-material';
import Papa from 'papaparse';
import { useApi } from '../../utils/ApiModeContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../utils/NotificationContext';

const ProductImportPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const { services } = useApi();
  const queryClient = useQueryClient();
  const showNotification = useNotification();

  const mutation = useMutation({
    mutationFn: (newProduct) => services.products.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      // This will be part of a more detailed error report
      console.error("Failed to import product:", error);
    }
  });

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
    setImportResults(null);
  };

  const handleImport = () => {
    if (!csvFile) {
      showNotification('Please select a CSV file to import.', 'error');
      return;
    }

    setIsProcessing(true);
    setImportResults(null);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data, errors } = results;
        let successfulImports = 0;
        let failedImports = 0;
        const importErrors = [];

        if (errors.length > 0) {
            importErrors.push(...errors.map(e => `Parsing error on row ${e.row}: ${e.message}`));
        }

        for (const row of data) {
          try {
            // Basic validation
            if (!row.name || !row.price || !row.sku) {
                throw new Error(`Missing required fields (name, price, sku)`);
            }
            const newProduct = {
              name: row.name,
              sku: row.sku,
              barcode: row.barcode || '',
              category: row.category || 'Uncategorized',
              price: parseFloat(row.price),
              costPrice: parseFloat(row.costPrice) || 0,
              lowStockThreshold: parseInt(row.lowStockThreshold, 10) || 0,
            };
            await mutation.mutateAsync(newProduct);
            successfulImports++;
          } catch (error) {
            failedImports++;
            importErrors.push(`Failed to import product "${row.name || 'Unknown'}": ${error.message}`);
          }
        }

        setImportResults({ successfulImports, failedImports, importErrors });
        setIsProcessing(false);
        if(successfulImports > 0) {
            showNotification(`${successfulImports} products imported successfully!`, 'success');
        }
        if(failedImports > 0) {
            showNotification(`${failedImports} products failed to import. See details on page.`, 'error');
        }
      },
      error: (error) => {
        showNotification(`Error parsing CSV file: ${error.message}`, 'error');
        setIsProcessing(false);
      }
    });
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Import Products from CSV
        </Typography>
        <Typography paragraph>
          Upload a CSV file to bulk-import products into the system. The file should have the following columns:
        </Typography>
        <List dense>
            <ListItem><ListItemText primary="name (Required): The name of the product." /></ListItem>
            <ListItem><ListItemText primary="sku (Required): The Stock Keeping Unit." /></ListItem>
            <ListItem><ListItemText primary="price (Required): The selling price." /></ListItem>
            <ListItem><ListItemText primary="costPrice: The cost of the product." /></ListItem>
            <ListItem><ListItemText primary="category: The product category." /></ListItem>
            <ListItem><ListItemText primary="barcode: The product's barcode." /></ListItem>
            <ListItem><ListItemText primary="lowStockThreshold: The low stock warning level." /></ListItem>
        </List>

        <Box sx={{ mt: 3, mb: 2, p: 3, border: '1px dashed grey', borderRadius: '4px', textAlign: 'center' }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Select CSV File
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileChange}
            />
          </Button>
          {csvFile && (
            <Typography sx={{ mt: 2 }} display="flex" alignItems="center" justifyContent="center">
              <DescriptionIcon sx={{ mr: 1 }} /> {csvFile.name}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleImport}
          disabled={!csvFile || isProcessing}
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          {isProcessing ? <CircularProgress size={24} /> : 'Start Import'}
        </Button>

        {importResults && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Import Summary</Typography>
                <Alert severity={importResults.failedImports === 0 ? 'success' : 'warning'}>
                    Successfully imported {importResults.successfulImports} products.
                    <br />
                    Failed to import {importResults.failedImports} products.
                </Alert>
                {importResults.importErrors.length > 0 && (
                    <Paper sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
                        <Typography variant="subtitle1" color="error">Error Details:</Typography>
                        <List dense>
                            {importResults.importErrors.map((error, index) => (
                                <ListItem key={index}><ListItemText primary={error} /></ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductImportPage;
