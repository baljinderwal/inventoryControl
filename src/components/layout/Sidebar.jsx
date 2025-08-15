import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  Box,
  SwipeableDrawer
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

const sidebarVariants = {
  open: { width: drawerWidth, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { width: collapsedDrawerWidth, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

const textVariants = {
  open: { opacity: 1, x: 0, display: 'block', transition: { duration: 0.2 } },
  closed: { opacity: 0, x: -20, transitionEnd: { display: 'none' } }
};

const Sidebar = () => {
    const { user } = useAuth();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const prefersReducedMotion = useMediaQuery('@media (prefers-reduced-motion: reduce)');
    const location = useLocation();

    const filteredNavigation = navigation.filter(item => {
        if (!item.roles || !user) return false;
        return item.roles.includes(user.role);
    });

    const NavItem = ({ item }) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
            <Box component={motion.div} variants={navItemVariants} sx={{ position: 'relative' }}>
                <Tooltip
                    title={item.name}
                    placement="right"
                    arrow
                    disableHoverListener={!isCollapsed}
                >
                    <ListItemButton
                        component={NavLink}
                        to={item.href}
                        aria-label={item.name}
                        sx={{
                            px: 3,
                            py: 1.5,
                            minHeight: 48,
                            justifyContent: 'initial',
                            bgcolor: isActive ? 'action.selected' : 'transparent',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-indicator"
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '4px',
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '0 4px 4px 0',
                                }}
                            />
                        )}
                        <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 3, justifyContent: 'center', transition: 'margin 0.2s' }}>
                            <motion.div whileHover={{ scale: 1.1 }} aria-hidden="true">
                                <Icon />
                            </motion.div>
                        </ListItemIcon>
                        <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                variants={textVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <ListItemText primary={item.name} />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </ListItemButton>
                </Tooltip>
            </Box>
        );
    };

    const drawerContent = (
      <>
        <Toolbar sx={{ justifyContent: 'center', cursor: 'pointer' }} onClick={toggleSidebar}>
          <Typography variant="h6" noWrap component="div">
            {isCollapsed ? 'I-C' : 'Inv-Ctrl'}
          </Typography>
        </Toolbar>
        <Box component={motion.div} layout="position" sx={{ pt: 1 }}>
            <List component="nav">
                {filteredNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                ))}
            </List>
        </Box>
      </>
    );

    if (isMobile) {
        return (
            <SwipeableDrawer
                anchor="left"
                open={!isCollapsed}
                onClose={toggleSidebar}
                onOpen={toggleSidebar}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: 'background.paper' } }}
            >
                {drawerContent}
            </SwipeableDrawer>
        );
    }

    const MotionDrawer = motion(Drawer);

    return (
        <MotionDrawer
            variant="permanent"
            open
            variants={prefersReducedMotion ? {} : sidebarVariants}
            animate={isCollapsed ? "closed" : "open"}
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    bgcolor: 'background.paper',
                },
            }}
        >
            {drawerContent}
        </MotionDrawer>
    );
};

export default Sidebar;
