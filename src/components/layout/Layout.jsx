import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
const sidebarWidth = 240;
const collapsedSidebarWidth = 88;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSidebarToggle = () => {
    setCollapsed(!isCollapsed);
  };

  const topbarSx = {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(!isMobile && !isCollapsed && {
      width: `calc(100% - ${sidebarWidth}px)`,
      marginLeft: `${sidebarWidth}px`,
    }),
    ...(!isMobile && isCollapsed && {
      width: `calc(100% - ${collapsedSidebarWidth}px)`,
      marginLeft: `${collapsedSidebarWidth}px`,
    }),
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar
        onMobileSidebarOpen={handleMobileSidebarToggle}
        onSidebarToggle={handleSidebarToggle}
        sx={topbarSx}
      />
      <Sidebar
        width={sidebarWidth}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onMobileSidebarClose={handleMobileSidebarToggle}
        isCollapsed={isCollapsed}
        collapsedWidth={collapsedSidebarWidth}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Toolbar /> {/* Spacer for Topbar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
