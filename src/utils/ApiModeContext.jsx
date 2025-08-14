import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { productService } from '../services/productService';
import { stockService } from '../services/stockService';
import { reportService } from '../services/reportService';
import { poService } from '../services/poService';
import { supplierService } from '../services/supplierService';
import { userService } from '../services/userService';

const ApiModeContext = createContext();

export const ApiModeProvider = ({ children }) => {
  // Initialize state from localStorage or default to 'local'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('apiMode');
    return savedMode === 'api' ? 'api' : 'local';
  });

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'local' ? 'api' : 'local';
      localStorage.setItem('apiMode', newMode);
      return newMode;
    });
  };

  // The services object will be re-computed by useMemo whenever `mode` changes.
  // React Query will automatically refetch queries whose query keys depend on `mode`.
  const services = useMemo(() => {
    console.log(`Providing services for mode: ${mode}`);
    const serviceMode = mode === 'api' ? 'api' : 'local';
    return {
      products: productService[serviceMode],
      stock: stockService[serviceMode],
      reports: reportService[serviceMode],
      po: poService[serviceMode],
      suppliers: supplierService[serviceMode],
      users: userService[serviceMode],
    };
  }, [mode]);

  return (
    <ApiModeContext.Provider value={{ mode, toggleMode, services }}>
      {children}
    </ApiModeContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiModeContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiModeProvider');
  }
  return context;
};
