import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../../utils/AuthContext';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

const navigation = [
  { name: 'Dashboard', href: '/', icon: <AssessmentIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Products', href: '/products', icon: <InventoryIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Stock', href: '/stock', icon: <WarehouseIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  { name: 'Suppliers', href: '/suppliers', icon: <BusinessIcon />, roles: ['Admin', 'Manager'] },
  { name: 'Orders', href: '/orders', icon: <ShoppingCartIcon />, roles: ['Admin', 'Manager', 'Staff'] },
  {
    name: 'Reports',
    href: '/reports',
    icon: <SummarizeIcon />,
    roles: ['Admin', 'Manager'],
    children: [
      { name: 'Profitability', href: '/reports/profitability', icon: <TrendingUpIcon /> },
      { name: 'Stock Value', href: '/reports/stock-value', icon: <InventoryIcon /> },
      { name: 'Sales History', href: '/reports/sales-history', icon: <BarChartIcon /> },
      { name: 'Inventory Aging', href: '/reports/inventory-aging', icon: <AssessmentIcon /> },
      { name: 'Supplier Performance', href: '/reports/supplier-performance', icon: <PeopleIcon /> },
    ],
  },
  { name: 'Users', href: '/users', icon: <PeopleIcon />, roles: ['Admin'] },
];

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState({
    Reports: location.pathname.startsWith('/reports'),
  });

  const handleClick = (name) => {
    setOpen(prevOpen => ({ ...prevOpen, [name]: !prevOpen[name] }));
  };

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
          <React.Fragment key={item.name}>
            <ListItemButton
              component={item.children ? 'div' : NavLink}
              to={item.href}
              end={!item.children ? true : undefined}
              onClick={() => item.children && handleClick(item.name)}
              sx={{
                '&.active': {
                  backgroundColor: 'action.selected',
                  fontWeight: 'fontWeightBold',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
              {item.children ? (open[item.name] ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {item.children && (
              <Collapse in={open[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.name}
                      component={NavLink}
                      to={child.href}
                      sx={{
                        pl: 4,
                        '&.active': {
                          backgroundColor: 'action.selected',
                          fontWeight: 'fontWeightBold',
                        },
                      }}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
