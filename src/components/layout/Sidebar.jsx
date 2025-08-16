import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
import PersonIcon from '@mui/icons-material/Person';

import { useAuth } from '../../utils/AuthContext';
import { useSidebar } from '../../utils/SidebarContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 88;

const navigation = [
    { name: 'Dashboard', href: '/', icon: AssessmentIcon, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Profile', href: '/profile', icon: PersonIcon, roles: ['Admin', 'Manager', 'Staff'] },
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

const navListVariants = {
  open: {
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 }
  }
};

const navItemVariants = {
  open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000 } } },
  closed: { y: 20, opacity: 0, transition: { y: { stiffness: 1000 } } }
};


const Sidebar = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles || !user) return false;
    return item.roles.includes(user.role);
  });

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;

    return (
        <motion.div variants={navItemVariants}>
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
                    color: 'text.secondary',
                    borderLeft: `4px solid transparent`,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                    ...(isActive && {
                      color: 'primary.main',
                      fontWeight: 'fontWeightBold',
                      bgcolor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }),
                }}
                >
                <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 3, justifyContent: 'center', transition: 'margin 0.2s', color: 'inherit' }}>
                    <motion.div whileHover={{ scale: 1.1 }}>
                    <Icon />
                    </motion.div>
                </ListItemIcon>
                <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                        style: {
                            opacity: isCollapsed ? 0 : 1,
                            transition: 'opacity 0.2s ease-in-out',
                            whiteSpace: 'nowrap',
                        }
                    }}
                />
                </ListItemButton>
            </Tooltip>
        </motion.div>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, pt: 2 }}>
        <motion.div
            component="nav"
            variants={navListVariants}
            initial={hasAnimated ? false : 'closed'}
            animate="open"
        >
            <List sx={{ p: 0 }}>
            {filteredNavigation.map(item => (
                <NavItem key={item.name} item={item} />
            ))}
            </List>
        </motion.div>
      </Box>
    </Box>
  );

  const drawerSx = {
    width: (isCollapsed ? collapsedDrawerWidth : drawerWidth),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '& .MuiDrawer-paper': {
      width: 'inherit',
      transition: 'inherit',
      top: { xs: 0, md: `64px`},
      height: { xs: '100%', md: `calc(100% - 64px)`},
      boxSizing: 'border-box',
      overflowX: 'hidden',
      borderRight: { md: `1px solid ${theme.palette.divider}` },
      // Light theme styles
      backgroundColor: 'background.paper',
    },
  };

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="left"
        open={!isCollapsed}
        onClose={toggleSidebar}
        onOpen={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={drawerSx}
      >
        <Box sx={theme.mixins.toolbar} /> {/* Spacer */}
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  return (
    <Drawer variant="permanent" sx={drawerSx}>
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
