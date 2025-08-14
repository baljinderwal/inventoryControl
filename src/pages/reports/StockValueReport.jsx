import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStockLevels } from '../../services/stockService';
import { getLocations } from '../../services/locationService';
import { Parser } from '@json2csv/plainjs';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const StockValueReport = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { data: stockLevels = [], isLoading: isLoadingStock, isError: isErrorStock, error: errorStock } = useQuery({
    queryKey: ['stockLevels'],
    queryFn: getStockLevels,
  });

  const { data: locations = [], isLoading: isLoadingLocations, isError: isErrorLocations, error: errorLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const stockValueReport = useMemo(() => {
    if (!Array.isArray(stockLevels)) return { totalValue: 0, reportData: [] };

    const filteredStock = selectedLocation
      ? stockLevels.filter(s => s.locationId === selectedLocation.id)
      : stockLevels;

    const reportData = filteredStock.map(s => ({
      productName: s.product.name,
      productSku: s.product.sku,
      locationName: s.location.name,
      quantity: s.quantity,
      costPrice: s.product.costPrice,
      inventoryValue: s.quantity * s.product.costPrice,
    }));

    const totalValue = reportData.reduce((sum, s) => sum + s.inventoryValue, 0);

    return { totalValue, reportData };
  }, [stockLevels, selectedLocation]);

  const handleExport = () => {
    const fields = ['productName', 'productSku', 'locationName', 'quantity', 'costPrice', 'inventoryValue'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(stockValueReport.reportData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_value_report_${selectedLocation ? selectedLocation.name : 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = isLoadingStock || isLoadingLocations;
  const isError = isErrorStock || isErrorLocations;
  const error = errorStock || errorLocations;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching data: {error.message}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Stock Value Report
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={stockValueReport.reportData.length === 0}
        >
          Export as CSV
        </Button>
      </Box>

      <Autocomplete
        options={locations}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setSelectedLocation(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Filter by Location" />}
        sx={{ mb: 2, maxWidth: 300 }}
      />

      <Typography variant="h5" component="p">
        Total Inventory Value ({selectedLocation ? selectedLocation.name : 'All Locations'}):
        <Typography variant="h5" component="span" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
          ${stockValueReport.totalValue.toFixed(2)}
        </Typography>
      </Typography>
      <Typography color="text.secondary">
        This report calculates the total value of inventory based on the cost price of each product.
      </Typography>
    </Paper>
  );
};

export default StockValueReport;
