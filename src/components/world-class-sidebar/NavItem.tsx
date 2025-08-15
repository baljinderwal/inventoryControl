import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NavLeaf } from '@/types/navigation';
import { useSidebarStore } from './store';
import { itemVariants } from './constants';

interface NavItemProps {
  item: NavLeaf;
}

const NavItem: React.FC<NavItemProps> = ({ item }) => {
  const { isCollapsed } = useSidebarStore();
  const theme = useTheme();
  const { id, label, icon: Icon, to, badge } = item;

  // Check if the route is active
  const isActive = useMatch(to || '');

  const linkContent = (
    <>
      {isActive && (
        <motion.div
          layoutId="active-accent"
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: '4px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
          }}
        />
      )}
      <ListItemIcon sx={{ minWidth: 'auto', marginRight: isCollapsed ? 0 : 2, zIndex: 1 }}>
        {Icon && <Icon size={20} />}
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            variant: 'body2',
            sx: { fontWeight: isActive ? 'bold' : 'medium' },
          }}
        />
      )}
      {!isCollapsed && badge?.value && (
        <Badge
          badgeContent={badge.value}
          color={badge.variant || 'default'}
          sx={{ marginRight: 1 }}
        />
      )}
    </>
  );

  return (
    <motion.div variants={itemVariants}>
      <Tooltip title={isCollapsed ? label : ''} placement="right">
        <ListItemButton
          component={NavLink}
          to={to || '#'}
          key={id}
          sx={{
            position: 'relative',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            px: isCollapsed ? 2.5 : 3,
            py: 1.5,
            borderRadius: 2,
            margin: '4px 8px',
            // Use a transparent background for the active state
            // The accent bar and font weight will indicate active state
            '&.active': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {linkContent}
        </ListItemButton>
      </Tooltip>
    </motion.div>
  );
};

export default NavItem;
