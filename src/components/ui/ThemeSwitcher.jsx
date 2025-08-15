import React, { useState } from 'react';
import { useThemeContext } from '../../utils/ThemeContext';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

const themes = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Sleek Dark' },
  { name: 'blue', label: 'Soothing Blue' },
];

const ThemeSwitcher = () => {
  const { themeName, setThemeName } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newThemeName) => {
    setThemeName(newThemeName);
    handleClose();
  };

  return (
    <div>
      <Tooltip title="Change Theme">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
        }}
      >
        {themes.map((theme) => (
          <MenuItem
            key={theme.name}
            selected={theme.name === themeName}
            onClick={() => handleThemeChange(theme.name)}
          >
            {theme.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ThemeSwitcher;
