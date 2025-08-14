import React, { createContext, useState, useContext, useMemo } from 'react';
import { productService } from '../services/productService';
import { stockService } from '../services/stockService';
import { reportService } from '../services/reportService';
import { poService } from '../services/poService';
import { supplierService } from '../services/supplierService';
import { userService } from '../services/userService';


const ApiModeContext = createContext();

export const ApiModeProvider = ({ children }) => {
  const [mode, setMode] = useState('local'); // 'local' or 'api'

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'local' ? 'api' : 'local';
      // You might want to store this preference in localStorage
      // localStorage.setItem('apiMode', newMode);
      alert(`Switched to ${newMode.toUpperCase()} mode. The page will now reload to apply changes.`);
      // A full reload might be the simplest way to ensure all components refetch data
      // with the new service implementations, especially with React Query's caching.
      setTimeout(() => window.location.reload(), 500);
      return newMode;
    });
  };

  // useEffect(() => {
  //   const savedMode = localStorage.getItem('apiMode');
  //   if (savedMode) {
  //     setMode(savedMode);
  //   }
  // }, []);

  const services = useMemo(() => {
    console.log(`Providing services for mode: ${mode}`);
    return {
      products: productService[mode],
      stock: stockService[mode],
      reports: reportService[mode],
      po: poService[mode],
      suppliers: supplierService[mode],
      users: userService[mode],
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
