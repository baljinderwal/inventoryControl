import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` } }}
      >
        <Toolbar /> {/* Spacer for the fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
