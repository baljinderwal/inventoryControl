import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Switch, Divider } from '@mui/material';
import { WbSunny, Brightness_2, Menu, ArrowBack } from '@mui/icons-material';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const ThemingDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const theme = {
    light: {
      background: '#f5f5f5',
      paper: '#ffffff',
      text: '#000000',
    },
    dark: {
      background: '#303030',
      paper: '#424242',
      text: '#ffffff',
    },
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" mb={5}>
            Customize Your Experience
        </Typography>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Paper
          elevation={12}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            background: currentTheme.background,
            color: currentTheme.text,
            transition: 'background 0.3s, color 0.3s',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              bgcolor: currentTheme.paper,
              borderBottom: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
            }}
          >
            <IconButton
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <Menu sx={{color: currentTheme.text}} /> : <ArrowBack sx={{color: currentTheme.text}} />}
            </IconButton>
            <Typography variant="h6">My App</Typography>
            <Box>
              <Switch
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                icon={<WbSunny />}
                checkedIcon={<Brightness_2 />}
                aria-label="Toggle dark mode"
              />
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ display: 'flex', height: 400 }}>
            {/* Sidebar */}
            <Motion.div
              initial={false}
              animate={{ width: isSidebarCollapsed ? 60 : 200 }}
              transition={{ duration: 0.3 }}
              style={{
                background: currentTheme.paper,
                borderRight: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" noWrap>Dashboard</Typography>
                <Typography variant="subtitle1" noWrap>Products</Typography>
                <Typography variant="subtitle1" noWrap>Orders</Typography>
              </Box>
            </Motion.div>

            {/* Content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h5" mb={2}>
                Main Content
              </Typography>
              <Typography>
                This is where the main application content would be displayed.
                Toggle the theme and sidebar to see the changes.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ThemingDemo;
