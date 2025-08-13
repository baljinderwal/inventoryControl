import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Grid from '@mui/material/Grid';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';

const reports = [
  {
    path: '/reports/profitability',
    title: 'Profitability Report',
    description: 'Analyze revenue, costs, and profit margins.',
    icon: <ShowChartIcon />,
  },
  {
    path: '/reports/stock-value',
    title: 'Stock Value Report',
    description: 'View the total value of your current inventory.',
    icon: <InventoryIcon />,
  },
  {
    path: '/reports/sales-history',
    title: 'Sales History',
    description: 'Track historical sales data and trends.',
    icon: <BarChartIcon />,
  },
  {
    path: '/reports/inventory-aging',
    title: 'Inventory Aging',
    description: 'Identify slow-moving and obsolete stock.',
    icon: <AssessmentIcon />,
  },
  {
    path: '/reports/supplier-performance',
    title: 'Supplier Performance',
    description: 'Evaluate supplier reliability and lead times.',
    icon: <PeopleIcon />,
  },
];

const ReportsPage = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Select a report from the list below to view detailed analytics and insights.
      </Typography>
      <List>
        {reports.map((report, index) => (
          <ListItem
            button
            component={RouterLink}
            to={report.path}
            key={index}
            sx={{ border: '1px solid #ddd', mb: 2, borderRadius: '8px' }}
          >
            <ListItemIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }}>
              {report.icon}
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="h6">{report.title}</Typography>}
              secondary={report.description}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ReportsPage;
