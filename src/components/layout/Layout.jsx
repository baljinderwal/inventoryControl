import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSidebar } from '../../utils/SidebarContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 88;

const Layout = () => {
  const theme = useTheme();
  const { isCollapsed } = useSidebar();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const mainContentMarginLeft = isMobile ? 0 : (isCollapsed ? collapsedDrawerWidth : drawerWidth);

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            xs: '100%',
            md: `calc(100% - ${mainContentMarginLeft}px)`
          },
          marginLeft: { md: `${mainContentMarginLeft}px` },
          transition: theme.transitions.create(['margin-left', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for Topbar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
