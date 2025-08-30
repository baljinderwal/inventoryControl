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
  { label: 'Stock Expiry', value: '/reports/stock-expiry' },
];

const ReportsLayout = () => {
  const location = useLocation();

  const currentTab = reportTabs.find(tab => tab.value === location.pathname);
  const tabValue = currentTab ? currentTab.value : false;

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive insights into your business performance and inventory metrics
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          aria-label="reports navigation tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              minHeight: 48,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateY(-1px)'
              },
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 700
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }
          }}
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
