import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const reportTabs = [
  { label: 'Profitability', value: '/reports/profitability' },
  { label: 'Sales History', value: '/reports/sales-history' },
  { label: 'Inventory Aging', value: '/reports/inventory-aging' },
  { label: 'Supplier Performance', value: '/reports/supplier-performance' },
  { label: 'Stock Value', value: '/reports/stock-value' },
];

const ReportsLayout = () => {
  const location = useLocation();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={location.pathname}
          aria-label="reports navigation tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {reportTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              component={NavLink}
              to={tab.value}
            />
          ))}
        </Tabs>
      </Box>
      <Outlet />
    </Paper>
  );
};

export default ReportsLayout;
