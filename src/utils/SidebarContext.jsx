import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const storedValue = localStorage.getItem('sidebar-collapsed');
      return !!JSON.parse(storedValue);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    } catch (error) {
      console.error("Failed to save sidebar state to localStorage", error);
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const value = useMemo(() => ({
    isCollapsed,
    toggleSidebar,
  }), [isCollapsed]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined || context === null) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
