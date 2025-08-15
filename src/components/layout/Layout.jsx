import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSidebar } from '../../utils/SidebarContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 88;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isCollapsed } = useSidebar();

  const mainContentWidth = isMobile
    ? '100%'
    : `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: mainContentWidth,
          ml: isMobile ? 0 : `${isCollapsed ? collapsedDrawerWidth : drawerWidth}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for the fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
