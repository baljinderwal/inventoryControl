import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  // Initialize state directly and synchronously from localStorage.
  // This is the most robust way to prevent state flickering on re-renders
  // after the initial load.
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const storedValue = localStorage.getItem('sidebar-collapsed');
      // The `!!` converts the parsed value (or null) to a boolean.
      return !!JSON.parse(storedValue);
    } catch {
      return false; // Default to false if localStorage is invalid or missing
    }
  });

  // This effect syncs state changes back to localStorage.
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
