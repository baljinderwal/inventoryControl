import React from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BusinessIcon from '@mui/icons-material/Business';
import SummarizeIcon from '@mui/icons-material/Summarize'; // Import new icon
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const drawerWidth = 240;

const navigation = [
  { name: 'Dashboard', href: '/', icon: <AssessmentIcon /> },
  { name: 'Products', href: '/products', icon: <InventoryIcon /> },
  { name: 'Stock', href: '/stock', icon: <WarehouseIcon /> },
  { name: 'Suppliers', href: '/suppliers', icon: <BusinessIcon /> },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: <ShoppingCartIcon /> },
  { name: 'Reports', href: '/reports', icon: <SummarizeIcon /> }, // Add new link
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' }, // Hide on small screens
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Inv-Ctrl
        </Typography>
      </Toolbar>
      <List>
        {navigation.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.href}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
