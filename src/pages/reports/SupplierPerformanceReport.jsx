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
} from '@mui/material';

const SupplierPerformanceReport = () => {
  const { mode, services } = useApi();
  const { data: performanceReport, isLoading, isError, error } = useQuery({
    queryKey: ['supplierPerformance', mode],
    queryFn: services.reports.getSupplierPerformance,
  });

  const handleExport = () => {
    if (!performanceReport) return;
    const fields = ['id', 'name', 'contact', 'email', 'totalOrders', 'completedOrders', 'pendingOrders', 'totalValue'];
    const parser = new Parser({ fields });
    const csv = parser.parse(performanceReport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'supplier_performance_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching supplier performance data: {error.message}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Supplier Performance Report
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={!performanceReport || performanceReport.length === 0}
        >
          Export as CSV
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        This report analyzes order volume and status for each supplier.
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">Total Orders</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell align="right">Total Order Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performanceReport && performanceReport.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell align="right">{supplier.totalOrders}</TableCell>
                <TableCell align="right">{supplier.completedOrders}</TableCell>
                <TableCell align="right">{supplier.pendingOrders}</TableCell>
                <TableCell align="right">${supplier.totalValue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SupplierPerformanceReport;
