import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const ColumnVisibilityControl = ({ allColumns, visibleColumns, onColumnChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleColumn = (columnId) => {
    const newVisibleColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter((id) => id !== columnId)
      : [...visibleColumns, columnId];
    onColumnChange(newVisibleColumns);
  };

  // Prevent closing menu when clicking on a checkbox
  const handleItemClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <Tooltip title="Show/Hide Columns">
        <IconButton onClick={handleClick} data-testid="column-visibility-button">
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {allColumns.map((column) => (
          <MenuItem key={column.id} onClick={handleItemClick}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleColumns.includes(column.id)}
                  onChange={() => handleToggleColumn(column.id)}
                />
              }
              label={column.label}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ColumnVisibilityControl;
