import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

export const CustomThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    try {
      const storedValue = localStorage.getItem('app-theme');
      return storedValue || 'light'; // Default to 'light' theme
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app-theme', themeName);
    } catch (error) {
      console.error("Failed to save theme state to localStorage", error);
    }
  }, [themeName]);

  const contextValue = useMemo(() => ({
    themeName,
    setThemeName,
  }), [themeName]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined || context === null) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};
