import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSidebar } from '../../utils/SidebarContext';

const sidebarWidth = 240;
const collapsedSidebarWidth = 88;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMobileSidebarOpen={handleMobileSidebarToggle} />
      <Sidebar
        width={sidebarWidth}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onMobileSidebarClose={handleMobileSidebarToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ml: { md: `${isCollapsed ? collapsedSidebarWidth : sidebarWidth}px` },
          width: { md: `calc(100% - ${isCollapsed ? collapsedSidebarWidth : sidebarWidth}px)` },
        }}
      >
        <Toolbar /> {/* Spacer for Topbar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
