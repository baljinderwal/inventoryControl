import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Paper, IconButton, List, Box, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material/ChevronLeft';
import { useSidebarStore } from './store';
import { sidebarVariants } from './constants';
import { SidebarProps } from '@/types/navigation';
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import { navigationConfig } from './config';

const WorldClassSidebar: React.FC<SidebarProps> = ({ items = navigationConfig }) => {
  const { isCollapsed, toggleCollapsed, setOpenGroup, isGroupOpen } = useSidebarStore();
  const navRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!navRef.current) return;

    const focusableElements = Array.from(
      navRef.current.querySelectorAll('a[href], [role="button"]')
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElements.findIndex(el => el === activeElement);

    const groupId = activeElement?.getAttribute('data-group-id');

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        focusableElements[prevIndex]?.focus();
        break;
      case 'ArrowRight':
        if (groupId && !isGroupOpen(groupId)) {
          event.preventDefault();
          setOpenGroup(groupId, true);
        }
        break;
      case 'ArrowLeft':
        if (groupId && isGroupOpen(groupId)) {
          event.preventDefault();
          setOpenGroup(groupId, false);
        }
        break;
      case 'Home':
        event.preventDefault();
        focusableElements[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        focusableElements[focusableElements.length - 1]?.focus();
        break;
    }
  };

  return (
    <motion.div
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      style={{
        position: 'relative',
        height: '100vh',
        zIndex: 1100,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, height: 64 }}>
          {!isCollapsed && (
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
              Inv-Ctrl
            </Typography>
          )}
          <IconButton onClick={toggleCollapsed} sx={{ justifySelf: 'flex-end' }}>
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        <List component="nav" sx={{ px: 2 }} ref={navRef} onKeyDown={handleKeyDown}>
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.05 }}
          >
            {items.map((item) =>
              item.type === 'group' ? (
                <NavGroup key={item.id} item={item} />
              ) : (
                <NavItem key={item.id} item={item} />
              )
            )}
          </motion.div>
        </List>
      </Paper>
    </motion.div>
  );
};

export default WorldClassSidebar;
