export const SIDEBAR_TOKENS = {
  width: {
    expanded: 280,
    collapsed: 80,
  },
  radius: 16,
  itemHeight: 48,
  indicator: {
    thickness: 3,
  },
  motion: {
    fast: 150,
    base: 220,
    slow: 320,
  },
  zIndex: {
    drawer: 1200,
    header: 1100,
  },
};

export const groupVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { staggerChildren: 0.02, when: 'beforeChildren' },
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export const sidebarVariants = {
  collapsed: {
    width: SIDEBAR_TOKENS.width.collapsed,
    transition: { type: 'spring', stiffness: 260, damping: 32 },
  },
  expanded: {
    width: SIDEBAR_TOKENS.width.expanded,
    transition: { type: 'spring', stiffness: 260, damping: 32 },
  },
};
