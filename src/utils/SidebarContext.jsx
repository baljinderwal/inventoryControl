import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  // Default to false and hydrate from localStorage in a useEffect.
  // This is more robust in environments with server-rendering or strict mode.
  const [isCollapsed, setIsCollapsed] = useState(false);

  // On initial mount, check localStorage for a persisted state.
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem('sidebar-collapsed');
      if (storedValue !== null) {
        setIsCollapsed(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error("Failed to parse sidebar state from localStorage", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // When the state changes, persist it to localStorage.
  useEffect(() => {
    // A try-catch block is good practice for localStorage access.
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
