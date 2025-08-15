# World-Class Sidebar

A production-ready, config-driven, animated, and accessible sidebar component for modern web applications.

## Features

- **Config-Driven:** Navigation structure is defined by a simple JSON/TypeScript schema.
- **Responsive:** Fixed on desktop, collapsible to an icon-only mode, and a temporary drawer on mobile/tablet.
- **Accessible:** Full keyboard navigation (roving tabindex), ARIA attributes, and screen reader support.
- **Animated:** Smooth animations for expanding/collapsing, with staggered item reveals, powered by Framer Motion.
- **Stateful:** Remembers collapsed state and open groups across page reloads using `localStorage`.
- **Themable:** Integrates seamlessly with Material-UI themes.

## Getting Started

To use the sidebar, integrate it into your main layout component. It's designed to work alongside a top bar/header.

```tsx
// Example: src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme, Drawer } from '@mui/material';
import Topbar from './Topbar';
import { WorldClassSidebar } from '../world-class-sidebar';
import { useSidebarStore } from '../world-class-sidebar/store';
import { SIDEBAR_TOKENS } from '../world-class-sidebar/constants';
import { navigationConfig } from '../world-class-sidebar/config'; // Your config here

const Layout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { isMobileDrawerOpen, toggleMobileDrawer } = useSidebarStore();

  const sidebarContent = <WorldClassSidebar items={navigationConfig} />;

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />

      {isDesktop ? (
        sidebarContent
      ) : (
        <Drawer
          variant="temporary"
          open={isMobileDrawerOpen}
          onClose={toggleMobileDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_TOKENS.width.expanded,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for the fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
```

## Configuration

The sidebar's navigation links are configured via the `items` prop, which takes an array of `NavEntry` objects.

### `NavEntry` Schema

There are two types of entries: `NavLeaf` (a single item) and `NavGroup` (a collapsible group).

```typescript
// src/types/navigation.ts
export type NavBadge = {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  value?: number | string;
};

export type NavItemBase = {
  id: string; // Unique ID for the item
  label: string; // Display text
  icon?: React.ReactNode; // e.g., an icon from lucide-react
  to?: string; // React Router path
  badge?: NavBadge;
  disabled?: boolean;
};

export type NavLeaf = NavItemBase & { type: 'item' };
export type NavGroup = NavItemBase & {
  type: 'group';
  children: Array<NavLeaf | NavGroup>; // Nested items
};

export type NavEntry = NavLeaf | NavGroup;
```

### Example Config

```typescript
// src/components/world-class-sidebar/config.ts
import { Home, Package, ShoppingCart } from 'lucide-react';

export const navigationConfig: NavEntry[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    type: 'item',
    icon: Home,
    to: '/',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    type: 'group',
    icon: Package,
    children: [
      // ... child NavLeaf objects
    ],
  },
  // ... more items
];
```

## API - `<WorldClassSidebar />` Props

| Prop  | Type         | Default            | Description                               |
| :---- | :----------- | :----------------- | :---------------------------------------- |
| `items` | `NavEntry[]` | `navigationConfig` | The array of navigation items to render. |

## State Management

The sidebar's state (e.g., `isCollapsed`, `isMobileDrawerOpen`) is managed by a Zustand store. You can import `useSidebarStore` to access or modify the state from anywhere in the app.

- `isCollapsed`: `boolean` - Whether the desktop sidebar is in icon-only mode.
- `toggleCollapsed()`: `() => void` - Toggles the desktop sidebar state.
- `isMobileDrawerOpen`: `boolean` - Whether the mobile drawer is visible.
- `toggleMobileDrawer()`: `() => void` - Toggles the mobile drawer visibility.
- `openGroups`: `Record<string, boolean>` - A map of which groups are currently expanded.
- `setOpenGroup()`: `(id: string, isOpen: boolean) => void` - Opens or closes a specific group.

## Theming

The component uses `theme.palette.action.selected` for the active item background and `theme.palette.primary.main` for the active item indicator. You can override these values in your MUI theme to customize the appearance.

## Accessibility

- **Keyboard Navigation**: Full support for arrow keys, Home/End, and Enter/Space.
- **ARIA Roles**: Uses `nav`, `button`, `group` roles and `aria-expanded`, `aria-controls`, `aria-current` attributes.
- **Focus Management**: Focus is managed with a roving tabindex pattern.
- **Reduced Motion**: Respects `prefers-reduced-motion` to disable non-essential animations (via the `useReducedMotion` hook).
