import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Paper, Typography, Grid, Card, CardActionArea, CardContent, Box } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import InventoryIcon from '@mui/icons-material/Inventory';

const reports = [
  {
    title: 'Profitability Report',
    description: 'Analyze profit margins per product.',
    link: '/reports/profitability',
    icon: <TrendingUpIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Low Stock Alerts',
    description: 'View products that are running low on stock.',
    link: '/reports/low-stock',
    icon: <WarningIcon fontSize="large" color="warning" />,
  },
  {
    title: 'Sales History',
    description: 'Visualize sales trends over time.',
    link: '/reports/sales-history',
    icon: <AssessmentIcon fontSize="large" color="secondary" />,
  },
];

const ReportsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports Dashboard
      </Typography>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.title}>
            <Card>
              <CardActionArea component={RouterLink} to={report.link}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{report.icon}</Box>
                  <Typography variant="h6" component="div">
                    {report.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {report.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportsPage;
