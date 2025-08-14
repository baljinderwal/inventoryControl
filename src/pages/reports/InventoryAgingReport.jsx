import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { Parser } from '@json2csv/plainjs';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
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
  const { mode, services } = useApi();
  const { data: agingReport, isLoading, isError, error } = useQuery({
    queryKey: ['inventoryAging', mode],
    queryFn: services.reports.getInventoryAging,
  });

  const handleExport = () => {
    if (!agingReport) return;
    const fields = ['id', 'name', 'sku', 'category', 'stock', 'ageInDays'];
    const parser = new Parser({ fields });
    const csv = parser.parse(agingReport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'inventory_aging_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        This report shows the age of your current inventory. Products are sorted with the oldest items first.
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Age (Days)</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agingReport && agingReport.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
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
