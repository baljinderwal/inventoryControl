import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInventoryAging } from '../../services/reportService';
import { getLocations } from '../../services/locationService';
import { Parser } from '@json2csv/plainjs';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const getAgingColor = (days) => {
  if (days > 180) return 'error';
  if (days > 90) return 'warning';
  return 'success';
};

const InventoryAgingReport = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const { data: agingReport = [], isLoading: isLoadingAging, isError, error } = useQuery({
    queryKey: ['inventoryAging', selectedLocation],
    queryFn: () => getInventoryAging(selectedLocation?.id),
  });

  const handleExport = () => {
    if (!agingReport) return;
    const fields = ['name', 'sku', 'quantity', 'ageInDays', 'locationName'];
    const dataToExport = agingReport.map(item => ({
      ...item,
      locationName: locations.find(l => l.id === item.locationId)?.name || 'N/A'
    }));
    const parser = new Parser({ fields });
    const csv = parser.parse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'inventory_aging_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = isLoadingLocations || isLoadingAging;

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching inventory aging data: {error.message}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Inventory Aging Report
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={!agingReport || agingReport.length === 0}
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

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        This report shows the age of your current inventory. Products are sorted with the oldest items first.
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Age (Days)</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agingReport.map((product) => (
              <TableRow key={product.stockId}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{locations.find(l => l.id === product.locationId)?.name}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">{product.ageInDays}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={
                      product.ageInDays > 180
                        ? 'Very Old'
                        : product.ageInDays > 90
                        ? 'Old'
                        : 'Fresh'
                    }
                    color={getAgingColor(product.ageInDays)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryAgingReport;
