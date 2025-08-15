import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme, Drawer } from '@mui/material';
import Topbar from './Topbar';
import { WorldClassSidebar } from '../world-class-sidebar';
import { useSidebarStore } from '../world-class-sidebar/store';
import { SIDEBAR_TOKENS } from '../world-class-sidebar/constants';
import { navigationConfig } from '../world-class-sidebar/config';

const Layout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { isCollapsed, isMobileDrawerOpen, toggleMobileDrawer } = useSidebarStore();

  const sidebarWidth = isDesktop && isCollapsed ? SIDEBAR_TOKENS.width.collapsed : SIDEBAR_TOKENS.width.expanded;

  const sidebarContent = <WorldClassSidebar items={navigationConfig} />;

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />

      {isDesktop ? (
        <WorldClassSidebar items={navigationConfig} />
      ) : (
        <Drawer
          variant="temporary"
          open={isMobileDrawerOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_TOKENS.width.expanded,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isDesktop ? `calc(100% - ${sidebarWidth}px)` : '100%',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Toolbar /> {/* Spacer for the fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
