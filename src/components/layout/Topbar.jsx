import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchBar from '../ui/SearchBar'; // Reusing the existing SearchBar
import { Box } from '@mui/material';

const drawerWidth = 240;

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [lookupSku, setLookupSku] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (lookupSku.trim()) {
      navigate(`/products?sku=${lookupSku.trim()}`);
      setLookupSku('');
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Inventory Control
        </Typography>

        <Box sx={{ flexGrow: 1, ml: 3, display: 'flex', justifyContent: 'center' }}>
          <Box component="form" onSubmit={handleLookupSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
            <SearchBar
              value={lookupSku}
              onChange={(e) => setLookupSku(e.target.value)}
              placeholder="Scan or lookup by SKU..."
              sx={{
                color: 'inherit',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
                borderRadius: 1,
                width: '100%',
                '& .MuiInputBase-input': {
                  color: 'white',
                  padding: '8px 12px',
                },
                '& .MuiInputBase-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            />
          </Box>
        </Box>

        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
