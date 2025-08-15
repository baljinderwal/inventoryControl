import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const LOCAL_STORAGE_KEY = 'app-sidebar-state';

interface SidebarState {
  isCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  openGroups: Record<string, boolean>;
  toggleCollapsed: () => void;
  toggleMobileDrawer: () => void;
  setOpenGroup: (id: string, isOpen: boolean) => void;
  isGroupOpen: (id: string) => boolean;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      isMobileDrawerOpen: false,
      openGroups: {},
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
      setOpenGroup: (id, isOpen) =>
        set((state) => ({
          openGroups: { ...state.openGroups, [id]: isOpen },
        })),
      isGroupOpen: (id) => get().openGroups[id] || false,
    }),
    {
      name: LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist the state relevant for desktop
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        openGroups: state.openGroups,
      }),
    }
  )
);
