import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../utils/ApiModeContext';
import { Parser } from '@json2csv/plainjs';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

const SalesHistoryReport = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { mode, services } = useApi();

  const { data: salesHistory, isLoading, isError, error } = useQuery({
    queryKey: ['salesHistory', mode],
    queryFn: services.reports.getSalesHistory,
  });

  const monthlySales = useMemo(() => {
    if (!salesHistory) return [];
    const salesByMonth = salesHistory.reduce((acc, sale) => {
      const month = sale.completedAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += sale.totalSale;
      return acc;
    }, {});

    return Object.keys(salesByMonth)
      .map(month => ({
        month,
        totalSales: salesByMonth[month],
      }))
      .reverse();
  }, [salesHistory]);

  const handleExport = () => {
    if (!salesHistory) return;
    const fields = ['orderId', 'completedAt', 'productName', 'quantity', 'price', 'totalSale'];
    const opts = { fields, formatters: { completedAt: (value) => value.toISOString() } };
    const parser = new Parser(opts);
    const csv = parser.parse(salesHistory);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sales_history_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error fetching sales history: {error.message}</Alert>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Monthly Sales</Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={!salesHistory || salesHistory.length === 0}
            >
              Export Full Report
            </Button>
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>Detailed Sales History</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total Sale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((sale, index) => (
                    <TableRow key={`${sale.orderId}-${index}`}>
                      <TableCell>{sale.orderId}</TableCell>
                      <TableCell>{sale.completedAt.toLocaleDateString()}</TableCell>
                      <TableCell>{sale.productName}</TableCell>
                      <TableCell align="right">{sale.quantity}</TableCell>
                      <TableCell align="right">${sale.price.toFixed(2)}</TableCell>
                      <TableCell align="right">${sale.totalSale.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={salesHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SalesHistoryReport;
