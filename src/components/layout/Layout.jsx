import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // The Sidebar is a fixed-position Drawer that floats over the content.
          // Therefore, the main content does not need a margin-left.
          // It will correctly start below the Topbar (due to the Toolbar spacer)
          // and expand to fill the full width.
        }}
      >
        <Toolbar /> {/* Spacer for Topbar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
