import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Tooltip,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavGroup as NavGroupType } from '@/types/navigation';
import { useSidebarStore } from './store';
import NavItem from './NavItem';
import { itemVariants, groupVariants } from './constants';

interface NavGroupProps {
  item: NavGroupType;
}

const NavGroup: React.FC<NavGroupProps> = ({ item }) => {
  const { isCollapsed, isGroupOpen, setOpenGroup } = useSidebarStore();
  const { id, label, icon: Icon, children } = item;
  const isOpen = isGroupOpen(id);
  const controlsId = useId();

  const handleToggle = () => {
    if (!isCollapsed) {
      setOpenGroup(id, !isOpen);
    }
  };

  if (isCollapsed) {
    return (
      <motion.div variants={itemVariants}>
        <Tooltip title={label} placement="right">
          <ListItemButton sx={{ justifyContent: 'center', px: 2.5, py: 1.5, borderRadius: 2, margin: '4px 8px' }}>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {Icon && <Icon size={20} />}
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <ListItemButton
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={controlsId}
        data-group-id={id} // Add data attribute here
        sx={{
          px: 3,
          py: 1.5,
          borderRadius: 2,
          margin: '4px 8px',
        }}
      >
        <ListItemIcon sx={{ minWidth: 'auto', marginRight: 2 }}>
          {Icon && <Icon size={20} />}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            variant: 'body2',
            sx: { fontWeight: 'medium' },
          }}
        />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={controlsId}
            role="group"
            variants={groupVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <List component="div" disablePadding>
              {children.map((child) => (
                <div key={child.id} style={{ paddingLeft: '16px' }}>
                  {child.type === 'item' ? (
                    <NavItem item={child} />
                  ) : (
                    <NavGroup item={child} />
                  )}
                </div>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavGroup;
