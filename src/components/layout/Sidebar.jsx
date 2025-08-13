import React from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BusinessIcon from '@mui/icons-material/Business';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../../utils/AuthContext';

const drawerWidth = 240;

const navigation = [
  { name: 'Dashboard', href: '/', icon: <AssessmentIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Products', href: '/products', icon: <InventoryIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Stock', href: '/stock', icon: <WarehouseIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Suppliers', href: '/suppliers', icon: <BusinessIcon />, roles: ['Admin', 'Manager'] },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: <ShoppingCartIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Reports', href: '/reports', icon: <SummarizeIcon />, roles: ['Admin', 'Manager'] },
  { name: 'Users', href: '/users', icon: <PeopleIcon />, roles: ['Admin'] },
];

const Sidebar = () => {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles || !user) {
      return false;
    }
    return item.roles.includes(user.role);
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
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
      <List component="nav">
        {filteredNavigation.map((item) => (
          <ListItemButton
            key={item.name}
            component={NavLink}
            to={item.href}
            sx={{
              '&.active': {
                backgroundColor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
