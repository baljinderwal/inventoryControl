import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationCenter } from '../../utils/NotificationCenterContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationCenter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Potentially navigate to a related page in the future
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="show new notifications"
        onClick={handleClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '8px 16px' }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={() => { markAllAsRead(); }}>
              Mark all as read
            </Button>
          )}
        </Box>
        <Divider />
        <List dense sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <ListItemText primary="No new notifications" />
            </MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{ backgroundColor: notification.read ? 'inherit' : 'action.hover' }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.createdAt).toLocaleString()}
                />
              </MenuItem>
            ))
          )}
        </List>
      </Menu>
    </>
  );
};

export default NotificationBell;
