import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
  Box,
  SwipeableDrawer,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BusinessIcon from '@mui/icons-material/Business';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { useAuth } from '../../utils/AuthContext';
import { useSidebar } from '../../utils/SidebarContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 88;

const navigation = [
    { name: 'Dashboard', href: '/', icon: AssessmentIcon, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Products', href: '/products', icon: InventoryIcon, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Stock', href: '/stock', icon: WarehouseIcon, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Suppliers', href: '/suppliers', icon: BusinessIcon, roles: ['Admin', 'Manager'] },
    { name: 'Customers', href: '/customers', icon: PeopleIcon, roles: ['Admin', 'Manager'] },
    { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCartIcon, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Sales Orders', href: '/sales-orders', icon: ReceiptIcon, roles: ['Admin', 'Manager'] },
    { name: 'Reports', href: '/reports', icon: SummarizeIcon, roles: ['Admin', 'Manager'] },
    { name: 'Users', href: '/users', icon: PeopleIcon, roles: ['Admin'] },
    { name: 'Locations', href: '/settings/locations', icon: SettingsIcon, roles: ['Admin', 'Manager'] },
];

const Sidebar = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles || !user) return false;
    return item.roles.includes(user.role);
  });

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;

    return (
      <Tooltip title={isCollapsed ? item.name : ''} placement="right" arrow>
        <ListItemButton
          component={NavLink}
          to={item.href}
          aria-label={item.name}
          sx={{
            px: 3,
            py: 1.5,
            minHeight: 48,
            justifyContent: 'initial',
            bgcolor: isActive ? theme.palette.action.selected : 'transparent',
            borderLeft: `4px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
            transition: 'background-color 0.2s, border-left 0.2s',
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 3, justifyContent: 'center', transition: 'margin 0.2s' }}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Icon />
            </motion.div>
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transition: 'opacity 0.2s ease-in-out',
              whiteSpace: 'nowrap',
            }}
          />
        </ListItemButton>
      </Tooltip>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1 }}>
        <List component="nav" sx={{ pt: 2 }}>
          {filteredNavigation.map(item => (
            <NavItem key={item.name} item={item} />
          ))}
        </List>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="left"
        open={!isCollapsed}
        onClose={toggleSidebar}
        onOpen={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        <Box sx={theme.mixins.toolbar} /> {/* Spacer */}
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  const currentWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: currentWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          top: `64px`,
          height: `calc(100% - 64px)`,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
