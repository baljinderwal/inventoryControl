import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { locationService } from '../../services/locationService';
import { Parser } from '@json2csv/plainjs';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const StockValueReport = () => {
  const { mode, services } = useApi();
  const a_services = { ...services, locations: locationService[mode] };
  const [locationId, setLocationId] = useState('');

  const { data: locations = [] } = useQuery({
    queryKey: ['locations', mode],
    queryFn: () => a_services.locations.getLocations(),
  });

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['stock', mode, locationId],
    queryFn: () => services.stock.getStockLevels({ locationId: locationId === 'all' ? null : locationId }),
  });

  const stockValueReport = useMemo(() => {
    if (!Array.isArray(products)) return { totalValue: 0, reportData: [] };

    const reportData = products.map(p => ({
      ...p,
      inventoryValue: p.stock * p.costPrice,
    }));

    const totalValue = reportData.reduce((sum, p) => sum + p.inventoryValue, 0);

    return { totalValue, reportData };
  }, [products]);

  const handleExport = () => {
    const fields = ['id', 'name', 'sku', 'category', 'price', 'costPrice', 'stock', 'inventoryValue'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(stockValueReport.reportData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_value_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching product data: {error.message}</Alert>;
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
          disabled={!products || products.length === 0}
        >
          Export as CSV
        </Button>
      </Box>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="location-filter-label">Filter by Location</InputLabel>
        <Select
          labelId="location-filter-label"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          label="Filter by Location"
        >
          <MenuItem value="all">All Locations</MenuItem>
          {locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h5" component="p">
        Total Inventory Value:
        <Typography variant="h5" component="span" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
          ${stockValueReport.totalValue.toFixed(2)}
        </Typography>
      </Typography>
      <Typography color="text.secondary">
        This report calculates the total value of all inventory based on the cost price of each product.
      </Typography>
    </Paper>
  );
};

export default StockValueReport;
