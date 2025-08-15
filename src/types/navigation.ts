export type NavBadge = {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  value?: number | string;
  hidden?: boolean;
};

export type NavItemBase = {
  id: string;
  label: string;
  icon?: React.ReactNode; // icon element from MUI icons
  to?: string; // path for links
  external?: boolean;
  badge?: NavBadge;
  disabled?: boolean;
  permissions?: string[]; // keys checked by a guard
};

export type NavLeaf = NavItemBase & { type: 'item' };
export type NavGroup = NavItemBase & {
  type: 'group';
  children: Array<NavLeaf | NavGroup>;
  defaultOpen?: boolean;
};

export type NavEntry = NavLeaf | NavGroup;

export interface SidebarProps {
  items: NavEntry[];
  collapsed?: boolean;
  onCollapsedChange?: (next: boolean) => void;
  width?: number; // overrides token
  collapsedWidth?: number; // overrides token
  headerSlot?: React.ReactNode; // logo / brand
  footerSlot?: React.ReactNode; // version, links
  userSlot?: React.ReactNode; // user card
}
